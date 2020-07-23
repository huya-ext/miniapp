import json

class Player(object):
    """ 玩家对象 """
    uid = None
    score = 0
    nick = None
    avatar = None

    def __init__(self, uid):
        self.uid = uid

    def toDict(self):
        """ 转成字典 """
        player= {}
        player['uid'] = self.uid
        player['score'] = self.score
        player['nick'] = self.nick
        player['avatar'] = self.avatar
        return player

class PlayerEncoder(json.JSONEncoder): 
  def default(self, obj): 
    if isinstance(obj, Player): 
        return obj.toDict()
    return json.JSONEncoder.default(self, obj) 