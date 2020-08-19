import threading
import json
import time
import asyncio

import base64

from enum import Enum
from config import DefaultConfig
from logger import log
from .protocol import PROTOCOL
from util import ws_channel_util
from util import jwt_util
from hy_subscriber.subscriber import LiveSubscriber
from .player import Player, PlayerEncoder


class ERoomState(Enum):
    """ 房间状态枚举定义 """
    Gaming = 1
    GameOver = 2


class Room(object):
    """ 
    游戏房间，一般一个直播间对应一个游戏房间，同一个直播间游戏的玩家都会加入这个游戏房间
    核心的游戏玩法逻辑都在这里实现
    """

    # 房间号，就是主播直播间房间号
    roomId = None
    # 主播unionId
    presenterUid = None
    # 游戏开始时间
    gameStartedAt = None
    # 房间当前状态
    state = None
    # 所有连接到房间的观众和主播id列表
    allUids = []
    # 当前参与对局的观众和主播Player列表
    # signedPlayers = {}
    #
    reconnTimes = 0
    # 游戏计时检测定时器
    timer = None

    # 监听虎牙直播间送礼弹幕等事件
    liveSubscribers = {}

    # 重连虎牙直播间订阅服务的次数
    reconnTimes = 0

    # uid和直播房间号映射管理{uid1:liveRoomId1,uid2:liveRoomId2}
    uidLiveRoomIdDic = {}

    # 分组信息,{liveRoomId1: {uid1:player,uid2:player},{uid1:player,uid2:player}}
    teamDic = {}

    # 主播id列表
    presenterUids = []

    def __init__(self, roomId, presenterUid):
        self.roomId = roomId
        self.presenterUid = presenterUid
        self.presenterUids = []
        # self.signedPlayers = {}
        self.allUids = []
        self.reconnTimes = 0
        self.state = None
        self.gameStartedAt = None
        self.liveSubscribers = {}
        self.timer = None
        self.uidLiveRoomIdDic = {}
        self.teamDic = {}
        self.__connect_live_subscriber(self.roomId)


    def __connect_live_subscriber(self, liveRoomId):
        """ 连虎牙直播间订阅服务 """
        if DefaultConfig.LIVE_SUBSCRIBER:
            if self.liveSubscribers.__contains__(liveRoomId):
                self.liveSubscribers[liveRoomId].disconnect()
                del self.liveSubscribers[liveRoomId]

            wsUrl = jwt_util.build_huya_wsUrl(liveRoomId)
            liveSubscriber = LiveSubscriber(
                liveRoomId, wsUrl, DefaultConfig.LIVE_SUBSCRIBER_TOPICS,
                self.__live_message, self.__live_disconnect)
            liveSubscriber.connect()
            self.liveSubscribers[liveRoomId] = liveSubscriber


    async def onJoin(self, uid, liveRoomId=None, isPresenter=None):
        """ 玩家连接房间 """
        if not self.allUids.__contains__(uid):
            self.allUids.append(uid)

        if isPresenter:
            if not self.presenterUids.__contains__(uid):
                self.presenterUids.append(uid)

        # 如果是创建pk房间的主播自己
        if not liveRoomId:
            liveRoomId = self.roomId

        # 记录映射关系
        self.uidLiveRoomIdDic[uid] = liveRoomId

        data = {}
        data['uid'] = uid
        data['gaming'] = (self.state == ERoomState.Gaming)

        players = {}
        if self.teamDic.__contains__(liveRoomId):
            players = self.teamDic[liveRoomId]

        data['signedUp'] = (players.__contains__(uid))

        # 房间单播，玩家加入
        await self.__unicast(uid, PROTOCOL.S2CPlayerJoin, json.dumps(data, cls=PlayerEncoder))


    async def __broadcast_teams(self):
        """ 房间内广播分组信息 """
        data = {}
        # 构造用户列表
        result = []
        if self.teamDic:
            for i in self.teamDic:
                roomInfo = {}
                roomInfo['roomId'] = i
                users = []
                roomInfo['players'] = users
                players = self.teamDic[i]
                for j in players:
                    #添加主播
                    if players[j].isPresenter:
                        roomInfo['presenter'] = players[j]
                    else:
                        users.append(players[j])

                result.append(roomInfo)

        data['teams'] = result
        # 房间内广播分组信息
        await self.__broadcast(PROTOCOL.S2CTeams, json.dumps(data, cls=PlayerEncoder))


    async def signup(self, uid, data):
        """ 加入游戏 """

        liveRoomId = self.uidLiveRoomIdDic[uid]

        # 未加入游戏，且游戏人数没有满
        if self.teamDic.__contains__(liveRoomId) and not self.teamDic[liveRoomId].__contains__(uid) and len(self.teamDic[liveRoomId]) >= DefaultConfig.MAX_PLAYER_CNT:
            self.signup_failed(uid)
            return

        # 加入到分组中去
        players = {}
        if self.teamDic.__contains__(liveRoomId):
            players = self.teamDic[liveRoomId]

        if not players.__contains__(uid):
            player = Player(uid)

            nick = data['nick']
            if nick:
                nick = base64.b64decode(nick).decode("utf-8")
            player.nick = nick

            player.avatar = data['avatar']
            player.isPresenter = True if self.presenterUids.__contains__(uid) else False
            players[uid] = player
            self.teamDic[liveRoomId] = players

            # 第二个主播加入，监听第二个直播间的消息
            if self.presenterUids.__contains__(uid) and uid != self.presenterUid:
                self.__connect_live_subscriber(liveRoomId)

        data = {}
        data['success'] = True
        data['player'] = self.teamDic[liveRoomId][uid]
        # 单播加入游戏成功
        await self.__unicast(uid, PROTOCOL.S2CPlayerSignup, json.dumps(data, cls=PlayerEncoder))
        # 房间内广播分组信息
        await self.__broadcast_teams()


    async def signup_failed(self, uid):
        """ 加入失败 """
        data = {}
        data['success'] = False
        # 发给当前用户，加入失败
        await self.__unicast(uid, PROTOCOL.S2CPlayerSignup, json.dumps(data, cls=PlayerEncoder))


    async def start(self, uid):
        """ 开始游戏 """
        if uid == self.presenterUid and self.state != ERoomState.Gaming and len(self.teamDic) >= 2:
            self.state = ERoomState.Gaming
            self.gameStartedAt = int(time.time()*1000)  # 当前毫秒值
            # 房间内广播，游戏开始
            await self.__broadcast(PROTOCOL.S2CGameStart)

        # 启动计时检测
        self.timer = threading.Timer(
            DefaultConfig.GAME_DURATION, self.__game_over_task)
        self.timer.start()


    def __game_over_task(self):
        """ 创建异步任务 """
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(self.__gameOver())
        finally:
            loop.run_until_complete(loop.shutdown_asyncgens())
            loop.close()


    async def __gameOver(self):
        """ 游戏结束 """
        log.info('game timeout,gameOver,{}'.format(self.roomId))

        # 广播游戏结束，可附带排行榜等数据
        await self.__broadcast(PROTOCOL.S2CGameOver,  json.dumps(self.__build_rank(), cls=PlayerEncoder))

        self.state = ERoomState.GameOver

        if DefaultConfig.LIVE_SUBSCRIBER:
            for i in self.liveSubscribers:
                self.liveSubscribers[i].disconnect()

        from logic.room_mgr import room_manager
        room_manager.remove_room(self.roomId)


    async def gameOver(self, uid):
        """ 主播主动结束游戏 """
        if uid == self.presenterUid and self.state == ERoomState.Gaming:
            await self.__gameOver()


    async def playerScore(self, uid, data):
        """ 玩家上报得分 """
        if not self.uidLiveRoomIdDic.__contains__(uid):
            return

        liveRoomId = self.uidLiveRoomIdDic[uid]

        if not self.teamDic.__contains__(liveRoomId):
            return

        if self.teamDic[liveRoomId].__contains__(uid) and self.state == ERoomState.Gaming:
            self.teamDic[liveRoomId][uid].score = int(data['score'])
            data = self.__build_rank()
            await self.__broadcast(PROTOCOL.S2CRealtimeRank, json.dumps(data, cls=PlayerEncoder))


    def __build_rank(self):
        """ 构造pk实时得分排行榜 """

        result = []
        if self.teamDic:
            for i in self.teamDic:
                players = self.teamDic[i]
                total = 0
                roomInfo = {}
                roomInfo['roomId'] = i
                for j in players:
                    total = total + players[j].score
                    #添加主播
                    if players[j].isPresenter:
                        roomInfo['presenter'] = players[j]
                roomInfo['score'] = total
                result.append(roomInfo)
        return data


    async def __broadcast(self, uri,  data=None,  exUids=None):
        """ 广播 """
        await ws_channel_util.broadcast(self.roomId, uri, data, self.allUids)


    async def __unicast(self, uid, uri,  data=None):
        """ 发送给指定用户 """
        await ws_channel_util.unicast(self.roomId, uid, uri, data)


    def __live_message(self, roomId, notice, data):
        """ 收到虎牙直播间订阅消息回调 """

        log.info("收到直播间订阅消息:{},{},{}".format(self.roomId, notice, str(data)))
        if notice == "getSendItemNotice":
            # data dict 结构：
            # 'badgeName':'叶妃'
            # 'fansLevel':1
            # 'itemId':4
            # 'itemName':'虎粮'
            # 'nobleLevel':0
            # 'presenterNick':'xxx'
            # 'roomId':15687938
            # 'sendItemComboHits':1
            # 'sendItemCount':1
            # 'sendNick':'xxx'
            # 'senderAvatarurl':'http://huyaimg.msstatic.com/avatar/1021/...1509880585'
            # 'senderLevel':2
            # 'totalPay':0
            # 'unionId':'unck5...Bo'

            unionId = data['unionId']  # 发送者unionId
            sendNick = data['sendNick']  # 发送者昵称
            senderAvatarurl = data['senderAvatarurl']  # 发送者头像
            fansLevel = data['fansLevel']  # 粉丝等级
            itemId = data['itemId']  # 礼物id
            itemName = data['itemName']  # 礼物id
            sendItemComboHits = data['sendItemComboHits']  # 送礼连击数
            sendItemCount = data['sendItemCount']  # 送礼个数
            totalPay = data['totalPay']  # 礼物价值

            log.info("监听到直播间送礼消息:用户id：{}，昵称：{}，礼物Id:{}，礼物名称:{}，礼物数:{}，连击数:{}，totalPay:{}".format(
                unionId, sendNick, itemId, itemName, sendItemCount, sendItemComboHits, totalPay))

            # @TODO 业务逻辑。。。

        elif notice == "getMessageNotice":
            # 收到 弹幕消息
            # 'data':{'badgeName': '', 'content': 'xxx', 'fansLevel': 0, 'nobleLevel': 0, 'roomId': 12345678, 'sendNick': 'xxx', 'senderAvatarUrl': 'http://huyaimg.msst...521768567', 'senderGender': 0, 'senderLevel': 1, 'showMode': 0, 'unionId': 'unrm3gdloD/ZmcQCXRH...H/zi0j48p'}
            unionId = data['unionId']  # 发送者unionId
            sendNick = data['sendNick']  # 发送者昵称
            senderAvatarUrl = data['senderAvatarUrl']  # 发送者头像
            senderGender = data['senderGender']  # 发送者性别
            content = data['content']  # 弹幕内容
            log.info("监听到直播间弹幕消息:用户id：{}，昵称：{}，弹幕内容:{}".format(
                unionId, sendNick, content))

            # @TODO 业务逻辑。。。

        else:
            log.info("监听到直播间{}消息,内容:{}".format(notice, str(data)))


    def __live_disconnect(self, roomId):
        """ 订阅服务连接断开回调 """

        log.warn("监听直播间订阅消息连接断开:{}".format(self.roomId))
        if self.state != ERoomState.GameOver:
            reTrytimer = threading.Timer(
                2+self.reconnTimes*2, self.__retry_connect_live_subscriber, args=[roomId])
            reTrytimer.start()


    def __retry_connect_live_subscriber(self, roomId):
        """ 重连订阅服务 """

        if self.state == ERoomState.GameOver:
            return
        log.info("虎牙websocket断线重连 roomId:{}".format(roomId))
        self.__connect_live_subscriber(roomId)
        self.reconnTimes = self.reconnTimes + 1
        if self.reconnTimes >= 10:
            self.reconnTimes = 0
