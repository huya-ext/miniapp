


# .vscode\launch.json 文件添加：
# {
#     "name": "Python: 附加 test",
#     "type": "python",
#     "request": "attach",
#     "port": 5678,
#     "host": "localhost",
#     "pathMappings": [{ "localRoot": "${workspaceFolder}/src/test", "remoteRoot": "." }]
# }

# 远程调试代码 begin
# import ptvsd
# ptvsd.enable_attach(address = ('localhost', 5678))
# ptvsd.wait_for_attach()
# 远程调试代码 end

import time
import jwt
import random
import string

algorithms = 'HS256'

#@TODO 改成虎牙小程序平台上的appid
appId = 'test'
#@TODO 密钥，需要改成小程序平台上生成的
secret_key = 'test'


# src根目录下面创建：local.py local.py可以不提交到代码仓库，避免泄密
# class HyextConfig(object):
#     HUYA_APPID = 'xxxx'
#     HUYA_JWT_SECRET_KEY = 'xxxx'
try:
    import sys 
    sys.path.append("../")
    from local import HyextConfig
    appId = HyextConfig.HUYA_APPID
    secret_key = HyextConfig.HUYA_JWT_SECRET_KEY
except ImportError:
    pass


print("appid:{},secret_key:{}".format(appId,secret_key))


def get_iat():
    return int(time.time())

def random_string(slen=20):
    """ 生成随机字符串 """
    return ''.join(random.sample(string.ascii_letters + string.digits, slen))


def make_huya_jwt(isPresenter, profileId, roomid, uid):
    """ 生成测试用的虎牙jwt """

    iat = get_iat()
    exp = iat+30*24*60*60

    # 主播uid字符串，随意字符
    #profileId = uid if isPresenter else random_string()
    # 观众uid字符串，
    # 如果是生成主播端使用的jwt的话 userId跟profileId一致即可
    # 生成观众使用的jwt则随意不同的字符串即可
    userId = uid

    headers = {}
    headers['alg'] = "HS256"
    headers['typ'] = "JWT"

    payload = {}
    payload['creator']="DEV"
    payload['role']=   "P" if isPresenter else "U" 
    payload['profileId']=profileId
    payload['extId']="extId"
    payload['roomId']=roomid
    payload['userId']=userId
    payload['iat']=iat
    payload['exp']=exp
    payload['appId']=appId
    encoded = jwt.encode(payload, secret_key,headers=headers, algorithm=algorithms).decode('utf-8')
    print('encoded payload:'+ str(payload)+' jwt:'+ str(encoded))
    return encoded

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

def decode_huya_jwt(jwt_str):
    """ jwt解密方法 """
    decode = jwt.decode(jwt_str, secret_key, algorithms=algorithms)
    print('decode jwt:'+ str(jwt_str) +' payload:' + str(decode))
    return decode
    
if __name__ == "__main__":
    """ 
    生成测试用的jwt的入口方法
    使用方式：
    进入 src 目录，执行：

    python3 test/jwt_test.py

    会输出两个jwt字符串，一个主播端，一个观众端
    """
    # 生成主播jwt
    print('主播jwt:')
    encode = make_huya_jwt(True,'10000',"15687938","10000")
    encode = make_huya_jwt(True,'10001',"15687939","10001")
    #decode_huya_jwt(encode)
    # 生成观众jwt
    print('观众jwt:')
    encode = make_huya_jwt(False,'10000',"15687938","20000")
    encode = make_huya_jwt(False,'10001',"15687939","20001")

    # print('decode_huya_jwt:')
    # decode_huya_jwt('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiU1lTIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ1bnJtM2dkbG9EL1ptY1FDWFJIU3RxOHVGSC96aTBqNDhwIiwiYXBwSWQiOiJ1ZDgwMTM4MjY3MzEyOWRjIiwiZXh0SWQiOiIzZ3pydTYwciIsImV4cCI6MTU5NTQyOTc3MywidXNlcklkIjoidW5ybTNnZGxvRC9abWNRQ1hSSFN0cTh1RkgvemkwajQ4cCIsImlhdCI6MTU5NTQyNjE3Mywicm9vbUlkIjoiMTU2ODc5MzgifQ.6tFfJCjj-ueyLI43UaAnHlvdkiFsMlVe0-TEGJsPKzk')


