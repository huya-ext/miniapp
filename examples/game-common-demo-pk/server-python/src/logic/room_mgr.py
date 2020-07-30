from .room import Room

class RoomManager(object):
    """ 全局房间管理器，当前服务器上所有的房间都会在这里维护 """

    #直播间号对应的房间列表
    room_dic = {}
    #主播对应的pkroomId列表
    presenter_pkroom_dic = {}
 
    def get_room(self, roomId):
        """ 根据直播间号查询pk房间 """
        if self.room_dic.__contains__(roomId):
            return self.room_dic[roomId]
        return None

    def new_room(self, roomId, presenterUid):
        """ 主播自己创建pk房间 """
        room = Room(roomId, presenterUid)
        self.room_dic[roomId] = room
        #把主播自己加入pk房间映射关系
        self.presenter_pkroom_dic[presenterUid] = roomId
        return room

    def presenter_join_pkroom(self, roomId, presenterUid):
        """ 主播加入pk房间 """
        self.presenter_pkroom_dic[presenterUid] = roomId

    def get_pkroom_of_presenter(self, presenterUid):
        """ 根据主播ID查询对应的pk房间 """
        if self.presenter_pkroom_dic.__contains__(presenterUid):
            return self.presenter_pkroom_dic[presenterUid]
        return None


    def remove_room(self, roomId):
        """ 根据直播间号销毁房间 """
        if self.room_dic.__contains__(roomId):
            del self.room_dic[roomId]
            for i in self.presenter_pkroom_dic:
                if self.presenter_pkroom_dic[i] == roomId:
                    del self.presenter_pkroom_dic[i]
                    #@TODO 这里只考虑到1v1 pk的场景，如果非1v1 pk，这个代码需要改造
                    break

        

room_manager = RoomManager()
