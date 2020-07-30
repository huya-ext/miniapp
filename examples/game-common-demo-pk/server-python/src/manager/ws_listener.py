import json
from manager.ws_connects_mgr import ws_connects_mgr
from logger import log
from logic.room_mgr import room_manager
from util import ws_channel_util
from logic.protocol import PROTOCOL
from logic.game_packet import GamePacket


class WsListener(object):
    """ weboscket监听器 """

    async def onConnected(self, ws, roomId,  uid,  isPresenter, pkRoomId=None, profileId=None):
        """ 新建ws连接回调 """

        log.info('ws new:' + ',roomid:' + roomId + ',pkRoomId:' + (pkRoomId if pkRoomId else '') + ',isPresenter:'+ str(isPresenter)+
                 ',uid:'+uid + ' ws:'+str(ws))

        # 如果是主播
        if isPresenter:
            if not pkRoomId:
                pkRoomId = roomId
        else:
            # 观众需要根据主播id去查一下
            pkRoomId = room_manager.get_pkroom_of_presenter(profileId)
            if not pkRoomId:
                # 观众连接，返回房间关闭
                await ws_channel_util.write(ws, GamePacket(PROTOCOL.S2CRoomClosed))
                await ws.close()

        # 查询pk房间
        room = room_manager.get_room(pkRoomId)

        # 房间不存在
        if not room:
            # 如果是主播,且pk房间号是自己的房间号，创建房间
            if isPresenter and pkRoomId == roomId:
                await ws_connects_mgr.onLogin(uid, pkRoomId, ws)
                room = room_manager.new_room(pkRoomId, uid)
                await room.onJoin(uid, isPresenter=isPresenter)
            else:
                # 非pk房主主播，或者观众连接，返回房间关闭
                await ws_channel_util.write(ws, GamePacket(PROTOCOL.S2CRoomClosed))
                await ws.close()
        else:
            # 房间存在
            # 加入房间
            await ws_connects_mgr.onLogin(uid, pkRoomId, ws)
            await room.onJoin(uid, roomId, isPresenter=isPresenter)
            # 是主播
            if isPresenter:
                room_manager.presenter_join_pkroom(pkRoomId, uid)

    async def onData(self, ws, gamePacket):
        """ 收到ws数据包时回调 """

        protocol = gamePacket.protocol
        roomId = ws_connects_mgr.getRoomId(ws)
        uid = ws_connects_mgr.getUid(ws)
        room = room_manager.get_room(roomId)

        # log.info('ws received:' + gamePacket.dump() + ' ws:'+str(ws))
        if protocol != PROTOCOL.C2SHeartbeat:  # 游戏心跳包
            log.info("handle uid:{0} protocol:{1} of room:{2}".format(
                uid, protocol, room.roomId if room else ''))

        if not protocol or not room:
            # if not ws.closed:
            #     await ws_channel_util.write(ws, GamePacket(PROTOCOL.S2CRoomClosed))
            #     await ws.close()
            return

        # 根据客户端的包，来执行相应的操作
        if protocol == PROTOCOL.C2SHeartbeat:  # 游戏心跳包
            # 原样返回
            await ws_channel_util.write(ws, GamePacket(PROTOCOL.S2CHeartbeat, gamePacket.payload))
        elif protocol == PROTOCOL.C2SSignup:  # 加入游戏
            await room.signup(uid, json.loads(gamePacket.payload))
        elif protocol == PROTOCOL.C2SStart:  # 开始游戏
            await room.start(uid)
        elif protocol == PROTOCOL.C2SGameover:  # 主播主动结束游戏
            await room.gameOver(uid)
        elif protocol == PROTOCOL.C2SPlayerScore:  # 玩家上报得分
            await room.playerScore(uid, json.loads(gamePacket.payload))
        else:
            log.warn("protocol invalid:{},{}".format(
                protocol, gamePacket.dump()))
            pass

        pass

    async def onDisconnected(self, ws):
        """ ws连接断开 """

        log.info('ws closed:' + str(ws))

        ws_connects_mgr.onLogout(ws)
        if not ws.closed:
            await ws_channel_util.write(ws, GamePacket(PROTOCOL.S2CRoomClosed))
            await ws.close()
        pass


ws_listener = WsListener()
