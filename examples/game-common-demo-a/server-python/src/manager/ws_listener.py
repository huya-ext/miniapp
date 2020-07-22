
from manager.ws_connects_mgr import ws_connects_mgr
from logger import log
from logic.room_mgr import room_manager
from util import ws_channel_util
from logic.protocol import PROTOCOL
from logic.game_packet import GamePacket


class WsListener(object):
    """ weboscket监听器 """

    async def onConnected(self, ws, roomId,  uid,  isPresenter):
        """ 新建ws连接回调 """

        log.info('ws new:' + ',roomid:' + roomId +
                 ',uid:'+uid + ' ws:'+str(ws))

        room = room_manager.get_room(roomId)
        # 房间不存在
        if not room:
            # 如果是主播，创建房间
            if isPresenter:
                await ws_connects_mgr.onLogin(uid, roomId, ws)
                room = await room_manager.new_room(roomId, uid)
                await room.onJoin(uid)
            else:
                # 观众连接，返回房间关闭
                await ws_channel_util.write(ws, GamePacket(PROTOCOL.S2CRoomClosed))
                await ws.close()
        else:
            # 加入房间
            await ws_connects_mgr.onLogin(uid, roomId, ws)
            await room.onJoin(uid)


    async def onData(self, ws, gamePacket):
        """ 收到ws数据包时回调 """

        log.info('ws received:' + gamePacket.dump() + ' ws:'+str(ws))

        protocol = gamePacket.protocol
        roomId = ws_connects_mgr.getRoomId(ws)
        uid = ws_connects_mgr.getUid(ws)
        room = room_manager.get_room(roomId)

        log.info("handle uid:{0} protocol:{1} of room:{2}".format(
            uid, protocol, room.roomId if room else ''))

        if not protocol or not room:
            return

        # 根据客户端的包，来执行相应的操作
        if protocol == PROTOCOL.C2SHeartbeat:  # 游戏心跳包
            # 原样返回
            await ws_channel_util.write(ws, GamePacket(PROTOCOL.S2CHeartbeat, gamePacket.payload))
        elif protocol == PROTOCOL.C2SSignup:  # 加入游戏
            room.signup(uid, json.loads(gamePacket.payload))
        elif protocol == PROTOCOL.C2SStart:  # 开始游戏
            room.start(uid)
        elif protocol == PROTOCOL.C2SGameover:  # 主播主动结束游戏
            room.gameOver(uid)

        else:
            log.warn("protocol invalid:{0},{1}".format(
                protocol), gamePacket.dump())
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
