from .room import Room

class RoomManager(object):
    """ 全局房间管理器，当前服务器上所有的房间都会在这里维护 """

    #房间列表
    room_dic = {}

 
    def get_room(self, roomId):
        """ 查询房间 """
        if self.room_dic.__contains__(roomId):
            return self.room_dic[roomId]
        return None

    async def new_room(self, roomId, presenterUid):
        """ 创建房间 """
        room = Room(roomId, presenterUid)
        self.room_dic[roomId] = room
        return room

    def remove_room(self, roomId):
        """ 销毁房间 """
        if self.room_dic.__contains__(roomId):
            del self.room_dic[roomId]


room_manager = RoomManager()
