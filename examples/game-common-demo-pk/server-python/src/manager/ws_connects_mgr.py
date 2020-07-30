
class WsConnectsMgr(object):
    """ weboscket连接管理 """

    # ws为key uid:roomId 为value
    ws_connects_urid_dic = {}
    # uid:roomId为key ws为value
    urid_ws_connects_dic = {}

    async def onLogin(self, uid, roomId, ws):
        """ 链接成功后注册映射关系 """
        urid = self.__getURid(uid, roomId)
        old = self.getWs(uid, roomId)
        if old:
            if not old.closed:
                await old.close()
            self.onLogout(old)

        self.urid_ws_connects_dic[urid] = ws
        self.ws_connects_urid_dic[ws] = urid

    def onLogout(self, ws):
        """ 链接断开后注销映射关系 """
        if not self.ws_connects_urid_dic.__contains__(ws):
            return
        urid = self.ws_connects_urid_dic[ws]
        if self.urid_ws_connects_dic.__contains__(urid):
            del self.urid_ws_connects_dic[urid]
        del self.ws_connects_urid_dic[ws]

    def getWs(self, uid, roomId):
        """ 获得连接对象 """
        urid = self.__getURid(uid, roomId)
        if self.urid_ws_connects_dic.__contains__(urid):
            return self.urid_ws_connects_dic[urid]
        else:
            return None

    def __getURid(self, uid, roomId):
        return uid + ':'+roomId

    def __getUid(self, ruid):
        return ruid.split(':')[0]

    def __getRoomId(self, ruid):
        return ruid.split(':')[1]

    def getUid(self, ws):
        if self.ws_connects_urid_dic.__contains__(ws):
            return self.__getUid(self.ws_connects_urid_dic[ws])
        else:
            return None

    def getRoomId(self, ws):
        if self.ws_connects_urid_dic.__contains__(ws):
            return self.__getRoomId(self.ws_connects_urid_dic[ws])
        else:
            return None


ws_connects_mgr = WsConnectsMgr()
