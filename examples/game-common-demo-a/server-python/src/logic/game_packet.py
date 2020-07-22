import json
from logic.protocol import PROTOCOL
from logger import log

# 
class GamePacket(object):
    """ 游戏协议封装 """
    protocol = None #协议号枚举，PROTOCOL
    payload = None #协议数据，json字符串

    def __init__(self, protocol, payload=None):
        self.protocol = protocol
        self.payload = payload

    def dump(self):
        """ 转json字符串 """
        data = {'protocol':self.protocol.value,'payload':self.payload if self.payload else '{}'}
        json_str = json.dumps(data)
        return json_str

    @staticmethod
    def load(dict):
        """ 将字典对象转成GamePacket对象 """
        value = dict['protocol']
        protocol = None
        try:
            protocol = PROTOCOL(value)
        except Exception as e:
            log.error('load gamepacket error:'+ e.message)
            return None

        gamepacket =  GamePacket(protocol)
        if dict.__contains__('payload'):
            gamepacket.payload = dict['payload']
        return gamepacket


if __name__ == "__main__":
    packet = GamePacket(1234, '{"key":"v1"}')
    print('json:'+packet.dump())
