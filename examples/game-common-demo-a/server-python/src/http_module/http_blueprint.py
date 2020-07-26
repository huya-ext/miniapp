from sanic.response import json
from sanic import Blueprint
from functools import wraps
from util import decode_hyext_jwt

# http请求映射
http_bp = Blueprint('http_blueprint',url_prefix='/api')



def jwt_authorized():
    """ jwt认证装饰器 """

    def decorator(f):

        @wraps(f)
        async def decorated_function(request, *args, **kwargs):
            #校验jwt状态
            payload = check_jwt_status(request)

            if payload:
                response = await f(request, payload, *args, **kwargs)
                return response
            else:
                return json({'status': 'not_authorized'}, 403)
        return decorated_function
    return decorator


def check_jwt_status(request):
    """ 校验jwt是否合法 """

    payload = None
    headers = request.headers
    if not headers.__contains__('authorization'):
        return payload

    jwt = headers['authorization']
    #获得jwt中的数据
    payload =  decode_hyext_jwt(jwt)

    return payload


@http_bp.route('/')
@jwt_authorized()
async def http_bp_root(request,payload):
    """ 
    http接口：/api/?jwt=xxx
    """
    return json({'result': str(payload)})
