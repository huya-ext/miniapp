import urllib3
import json
import logging


def send_post(url, post_data):
    # 创建PoolManager对象生成请求, 由该实例对象处理与线程池的连接以及线程安全的所有细节
    http = urllib3.PoolManager()
    # 填入从接口返回的jwt
    jwt = "test_jwt"
    headers = {
        "Content-Type": "application/json",
        "authorization": jwt,
    }
    # json.dumps方法可以将python对象转换为json对象
    post_data = json.dumps(post_data).encode()
    try:
        # response 包含status,data,header
        response = http.request(method="POST", url=url, body=post_data, headers=headers,
                                timeout=urllib3.Timeout(connect=1.0, read=1.0))
        print(response.status, response.data.decode('utf-8'))
        return response.data.decode('utf-8')
    except Exception as e:
        logging.exception(e)


appId = "testAppId"
extId = "testExtId"

post_data = {
    "profileId": "test_profileId",
    "event": "test_message",
    "message": "test_message",
}
url = "https://apiext.huya.com/message/deliverRoomByProfileId?appId=" + appId + "&extId=" + extId
send_post(url, post_data)
