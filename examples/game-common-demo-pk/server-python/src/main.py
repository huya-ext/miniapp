# 远程调试代码 begin
# import ptvsd
# ptvsd.enable_attach(address = ('localhost', 5678))
# ptvsd.wait_for_attach()
# 远程调试代码 end

from sanic import Sanic
from sanic.response import json
from sanic import Blueprint

from logger import log

from http_module import http_bp
from ws_module import ws_bp
from config import DefaultConfig

""" 
demo 游戏服务器主入口 
启动方式：python3 main.py
"""

app = Sanic('hygame-demo')
app.config.from_object(DefaultConfig)

group = Blueprint.group(http_bp, ws_bp)
app.blueprint(group)

if __name__ == "__main__":
  print('server start')
  app.run(host="0.0.0.0", port=DefaultConfig.PORT, debug=False, workers=4)