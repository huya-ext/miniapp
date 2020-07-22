
class Player(object):
    """ 玩家对象 """
    uid = None
    score = None
    nick = None
    avatar = None

    def __init__(self, uid):
        self.uid = uid
