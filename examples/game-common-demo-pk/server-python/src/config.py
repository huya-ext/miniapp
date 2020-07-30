
# 
class DefaultConfig(object):
    """ 配置文件，注意，配置项必须要大写！！！ """

    # sanic 定义参数 begin
    WEBSOCKET_MAX_SIZE = 5  # 5 seconds
    WEBSOCKET_MAX_QUEUE = 64  # 1 megabyte
    WEBSOCKET_READ_LIMIT = 4 ** 16
    WEBSOCKET_WRITE_LIMIT = 4 ** 16
    ACCESS_LOG = False
    # sanic 定义参数 end

    PORT = 9090     #服务器监听端口
    GAME_DURATION = 10*1    #游戏时长，秒
    MIN_PLAYER_CNT = 2  #开局最少玩家数量
    MAX_PLAYER_CNT = 10 #开局最多玩家数量

    LIVE_SUBSCRIBER = True #是否监听直播间送礼等消息
    LIVE_SUBSCRIBER_TOPICS = ['getMessageNotice','getSendItemNotice'] #是否监听直播间送礼等消息

    HUYA_APPID = 'test' #对应虎牙小程序平台注册时分配的appId(开发者ID)，https://ext.huya.com/#/i 查看
    HUYA_JWT_SECRET_KEY = 'test' #对应虎牙小程序平台注册时分配的appSecret(开发者密钥)，https://ext.huya.com/#/i 查看

    try:
        # src根目录下面创建：local.py
        #  本地配置
        # class HyextConfig(object):
        #     HUYA_APPID = 'xxxx'
        #     HUYA_JWT_SECRET_KEY = 'xxxx'

        from local import HyextConfig
        HUYA_APPID = HyextConfig.HUYA_APPID
        HUYA_JWT_SECRET_KEY = HyextConfig.HUYA_JWT_SECRET_KEY
    except ImportError:
        pass

    print("HUYA_APPID:{}".format(HUYA_APPID))

    def __init__(self):
        pass
