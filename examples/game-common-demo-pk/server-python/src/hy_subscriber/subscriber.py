
from logger import log

import websocket
import threading
import time
import json
import ssl
from websockets.exceptions import ConnectionClosed


class LiveSubscriber(object):
    """ 
    监听虎牙直播间送礼弹幕等事件
    参考文档：https://dev.huya.com/docs/#/open/%E5%BC%80%E6%94%BEAPI%E5%8D%8F%E8%AE%AE%E8%AF%B4%E6%98%8E
    """

    # 主播的房间号
    roomId = None

    # 虎牙直播的websocket 连接地址
    wsUrl = None

    # 要订阅的事件类型，参考文档查看
    topics = None

    # 处理订阅事件的业务回调方法
    onMessageCallback = None

    # 处理虎牙直播订阅连接断开的回调方法
    onDisconnectCallback = None

    # 连接虎牙直播websocket服务器的线程对象
    wsClientThread = None

    # websocket连接对象
    ws = None

    # websocket连接是否关闭
    isClose = False

    # ping定时器
    pingTimer = None

    needPing = False

    def __init__(self, roomId, wsUrl,
                 topics, onMessageCallback, onDisconnectCallback):
        """ 初始化 """
        self.roomId = roomId
        self.wsUrl = wsUrl
        self.topics = topics
        self.onMessageCallback = onMessageCallback
        self.onDisconnectCallback = onDisconnectCallback
        self.isClose = False
        self.ws = None
        self.pingTimer = None
        self.wsClientThread = None
        self.needPing = False

    def connect(self):
        """ 连接虎牙直播服务器 """

        self.needPing = True

        # 创建线程
        wsClientThread = threading.Thread(target=self.__start_ws_thread)

        # 启动线程
        wsClientThread.start()

        log.info("room:{},live subscriber thread start.".format(self.roomId))

    def disconnect(self):
        """ 断开连接 """

        self.needPing = False
        self.isClose = True
        self.wsClientThread = None
        self.pingTimer.cancel()
        self.pingTimer = None

    def __start_ws_thread(self):
        """
        启动一个新的线程来连接虎牙直播websocket服务器
        """

        self.ws = websocket.create_connection(
            self.wsUrl, sslopt={"cert_reqs": ssl.CERT_NONE})
        log.info("连接成功，开始订阅虎牙弹幕消息...roomId:{}".format(self.roomId))

        # 发送订阅消息
        commands = {}
        commands['command'] = 'subscribeNotice'
        commands['data'] = self.topics
        commands['reqId'] = int(time.time())

        self.ws.send(json.dumps(commands))

        # 启动定时ping
        self.__def_ping_timer()

        # 监听消息
        while not self.isClose:
            try:
                result = self.ws.recv()
                self.par_ws_message(result)
            except (Exception):
                self.onDisconnectCallback(self.roomId)
                break

        try:
            self.ws.close()
        except:
            pass

    def par_ws_message(self, data):
        """ 
        解析收到的虎牙直播websocket消息
        """

        # 字符串转成dict格式
        json_dict = json.loads(data)

        # 判断状态码
        if not json_dict or json_dict['statusCode'] != 200:
            return

        notice = json_dict['notice']

        # 判断类型
        if notice == 'command':
            # 判断是否有订阅失败的通知
            if json_dict['data'] \
                    and json_dict['data']['command'] == 'subscribeNotice' \
                    and json_dict['data']['failedList'] \
                    and len(json_dict['data']['failedList']) > 1 \
                    and json_dict['data']['failedList'][0] != '':
                log.error("roomId:{} 有订阅失败的topic:{}".format(self.roomId, data))
            else:
                log.info("订阅虎牙消息成功！roomId:{}".format(self.roomId))
        else:
            # 回调业务的消息处理方法
            self.onMessageCallback(self.roomId,notice, json_dict['data'])
        pass

    def __def_ping_timer(self):
        """ 启动定时ping """
        if self.needPing:
            self.pingTimer = threading.Timer(15, self.__ping)
            self.pingTimer.start()
            log.info("订阅完成，开始启动心跳定时器... roomId:{}".format(self.roomId))

    def __ping(self):
        """ 定期循环发送ping数据包，以免连接自动断开 """
        self.ws.send("ping")
        log.debug("room:{},live subscriber send ping.".format(self.roomId))
        # 新开一个定时器，因为是一次性的，所以每次都要新开
        self.__def_ping_timer()
