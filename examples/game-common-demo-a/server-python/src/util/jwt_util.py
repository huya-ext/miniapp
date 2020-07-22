
import time
import jwt
from config import DefaultConfig

algorithms = 'HS256'

# 密钥，需要改成小程序平台上生成的
secret_key = DefaultConfig.HUYA_JWT_SECRET_KEY

#
# 主播端 jwt payload 格式， userId 和 profileId 一样
# "creator" ->  "SYS"
# "role" ->  "P"
# "profileId" ->  "unrm3gdloD/xxxx/zi0j48p"
# "appId" ->  "xxx"
# "extId" ->  "3gzru60r"
# "exp" ->  1594891172
# "userId" ->  "unrm3gdloD/xxxx/zi0j48p"
# "iat" ->  1594887572
# "roomId" ->  "12345678"

# 观众端
# {
#   "creator": "SYS",
#   "role": "U",
#   "profileId": "unrm3gdloD/xxxx/zi0j48p",
#   "appId": "udxxx673129dc",
#   "extId": "3gzru60r",
#   "exp": 1595042734,
#   "userId": "unck5xxxx180oBo",
#   "iat": 1595039134,
#   "roomId": "12345678"
# }

def decode_hyext_jwt(jwt_str):
    """ 校验虎牙小程序jwt """

    decode = jwt.decode(jwt_str, secret_key, algorithms=algorithms)
    print('decode jwt:' + str(jwt_str) + ' payload:' + str(decode))
    return decode



def build_huya_wsUrl(roomId):
    """ 获得订阅直播间弹幕和送礼等消息的虎牙websocket服务器连接地址 """

    iat = get_iat()
    # 注意不小于当前时间且不超过当前时间60分钟；
    exp = iat + 60*60 - 1
    token = make_huya_wsserver_token(iat, exp, roomId)
    url = "wss://ws-apiext.huya.com:443/index.html?do=comm&roomId={}&appId={}&iat={}&exp={}&sToken={}"\
        .format(roomId, DefaultConfig.HUYA_APPID, iat, exp, token)
    return url

def make_huya_wsserver_token(iat, exp, roomId):
    """ 生成虎牙websocket服务器jwt token """

    headers = {}
    headers['alg'] = "HS256"
    headers['typ'] = "JWT"

    payload = {}
    payload['roomId'] = roomId
    payload['iat'] = iat
    payload['exp'] = exp
    payload['appId'] = DefaultConfig.HUYA_APPID

    jwt_str = jwt.encode(payload, secret_key, headers=headers,
                     algorithm=algorithms)
                     
    return jwt_str.decode('utf-8')


def get_iat():
    """ 生成iat """
    return int(time.time())
