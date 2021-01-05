#使用pyjwt
import jwt
import time
import logging


def get_token(appid, secret, extid, profileid, second):
    # 设置headers，即加密算法的配置
    headers = {
    "alg": "HS256",
    "typ": "JWT"
    }
    # 当前时间戳 秒
    iat = int(time.time())
    # 过期时间
    exp = iat + second

    payload = {
        "iat": iat,
        "exp": exp,
        "appId": appid,
        "extId": extid,
        "creator": "DEV",
        "profileId": profileid,
    }

    token = jwt.encode(payload=payload, key=secret, algorithm='HS256', headers=headers)
    print(token)
    return token


def parse_token(token, secret):
    # 解码token，第二个参数用于校验
    info = jwt.decode(jwt=token, key=secret, algorithms=['HS256'])
    print(info)
    return info


appId = "testAppId"
extId = "testExtId"
sceret = "testSecret"
profileId = "testProfileId"

token = get_token(appId, sceret, extId, profileId, 86400)
try:
    claims = parse_token(token, sceret)
except Exception as e:
    logging.exception(e)
