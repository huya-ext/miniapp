from sanic import Blueprint
from websockets.exceptions import ConnectionClosed
from functools import wraps

from util import decode_hyext_jwt
from manager import ws_listener
from logic.protocol import PROTOCOL
from logic.game_packet import GamePacket

from sanic.response import json as response_json

# 处理所有的 ws 请求
ws_bp = Blueprint('ws_blueprint', url_prefix='/ws')

def jwt_authorized():
    """ jwt认证装饰器 """

    def decorator(f):

        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            payload = check_jwt_status(request)

            if payload:
                response = await f(request, payload, *args, **kwargs)
                return response
            else:
                return response_json({'status': 'not_authorized'}, 403)
        return decorated_function
    return decorator


def check_jwt_status(request):
    """ 校验jwt是否合法 """

    payload = None
    args = request.args
    if not args.__contains__('jwt'):
        return payload

    jwt = args['jwt'][0]  # 从url的请求参数中获得jwt,请求的url应该是：?jwt=xxxx
    payload = decode_hyext_jwt(jwt)

    return payload



@jwt_authorized()
async def ws_bp_root(request, payload, ws):
    """ websocket 监听入口 """

    uid = payload['userId']
    roomId = payload['roomId']
    profileId = payload['profileId']

    isPresenter = False
    if profileId == uid:
        isPresenter = True

    # 连接成功回调
    await ws_listener.onConnected(ws, roomId,  uid,  isPresenter)
    # 持续监听
    while True:
        try:
            # 等待收到消息
            data = await ws.recv()
            import json
            # 消息解包成GamePacket对象
            packet = json.loads(data, object_hook=GamePacket.load)
            # 回调业务访问
            await ws_listener.onData(ws, packet)
        except (ConnectionClosed):
            # 回调连接断开方法
            await ws_listener.onDisconnected(ws)
            break

# 注册websocket处理方法
ws_bp.add_websocket_route(ws_bp_root, '/')
