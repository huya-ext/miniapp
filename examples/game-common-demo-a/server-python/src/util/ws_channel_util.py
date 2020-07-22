from logger import log
from logic.game_packet import GamePacket
from manager.ws_connects_mgr import ws_connects_mgr


""" 
websocket工具方法 
"""


async def write(ws, data):
    """ 
    往websocket连接写数据 
    data支持json字符串，或者GamePacket对象
    """
    if ws:
        if isinstance(data, GamePacket):
            await ws.send(data.dump())
        else:
            await ws.send(data)
    else:
        log.warn('ws is closed.')


async def broadcast(roomId,   uri,   data,  allUids, exUid=None):
    """ 房间内广播数据的方法，exUid为要排除的用户id列表 """

    game_packet = GamePacket(uri,  data)
    for uid in allUids:
        is_exclude = False  # 是否要排除当前uid
        if exUid and isinstance(exUid, list) or isinstance(exUid, tuple):
            if exUid.__contains__(uid):
                is_exclude = True
        elif exUid and exUid == uid:
            is_exclude = True
        else:
            is_exclude = False

        if not is_exclude:
            await unicast_packet(roomId, uid, game_packet)


async def unicast_packet(roomId, uid, game_packet):
    """ 单播方法，给房间内指定用户发送消息 """
    ws = ws_connects_mgr.getWs(uid, roomId)
    await write(ws, game_packet)


async def unicast(roomId, uid, uri, data):
    """ 单播方法，给房间内指定用户发送消息  """
    game_packet = GamePacket(uri,  data)
    ws = ws_connects_mgr.getWs(uid, roomId)
    await write(ws, game_packet)
