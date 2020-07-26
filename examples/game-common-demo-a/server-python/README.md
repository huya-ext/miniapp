# Python版demo用法说明

# 环境配置
## 系统要求
> ubuntu，mac，或者 wsl（windows 10 子系统）

## ubuntu或者wsl安装 python 3.8
```
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python3.8
```

## 安装sanic
`sudo pip3 install sanic`

## 安装PyJWT
`sudo pip3 install PyJWT`

## 安装websocket-client(订阅送礼消息)
`sudo pip3 install websocket-client`

---
# 启动运行
进入src目录，执行
`python3 main.py`

---

# 配合前端DEMO运行

前端demo地址：[client-pixi-js](https://github.com/huya-ext/miniapp/tree/master/examples/game-common-demo-a/client-pixi-js)

修改 h5\src\main.js
```
   const wssInstance = (this.wssInstance = new WebSocket(
            `ws://127.0.0.1:8081?jwt=${jwt || jwtMap[type]}`
        ));
```
其中，`ws://127.0.0.1:8081` 改为 `ws://127.0.0.1:9090/ws`

---

# 在windows 上用 vscode 进行远程调试
windows 端安装：`pip install ptvsd`
wsl端安装 `sudo pip3 install ptvsd`
用vscode打开`pthon/demo1`目录
创建目录及.vscode\launch.json 文件添加：

```
  "configurations": [
    {
      "name": "Python: 附加",
      "type": "python",
      "request": "attach",
      "port": 5678,
      "host": "localhost",
      "pathMappings": [{ "localRoot": "${workspaceFolder}/src", "remoteRoot": "." }]
    }
  ]

```
编辑 `main.py`, 把远程调试代码取消注释：
```
# 远程调试代码 begin
import ptvsd
ptvsd.enable_attach(address = ('localhost', 5678))
ptvsd.wait_for_attach()
# 远程调试代码 end
```

打开wsl，进入src目录，执行：`python3 main.py`

在vscode里面按F5打开调试工具，即可开始调试

---

# 开发测试
## 生成测试用的jwt的方法
进入 src 目录，执行：
`python3 test/jwt_test.py`

会输出两个jwt字符串，一个主播端，一个观众端

## http 接口调试

`curl --header "authorization:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiIxMDAwMCIsImV4dElkIjoiZXh0SWQiLCJyb29tSWQiOiIxMDAwIiwidXNlcklkIjoiMTAwMDAiLCJpYXQiOjE1OTUwNDA5NTYsImV4cCI6MTU5NzYzMjk1NiwiYXBwSWQiOiJhcHBJZCJ9.SdH3hz9UcdyR0vit4R7vPjhGKsseBlvbwHyzLF8s2RU" http://127.0.0.1:9090/api`

## websocket调试
Chrome websocket调试插件：https://www.ijidi.cn/crx-download/pfdhoblngboilpfeibdedpjgfnlcodoo-013.html

websocket url格式：

`ws://127.0.0.1:9090/ws?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiIxMDAwMCIsImV4dElkIjoiZXh0SWQiLCJyb29tSWQiOiIxMDAwIiwidXNlcklkIjoiMTAwMDAiLCJpYXQiOjE1OTUwNjY1MjQsImV4cCI6MTU5NzY1ODUyNCwiYXBwSWQiOiJ1ZDgwMTM4MjY3MzEyOWRjIn0.ScHg_c6Xs5FeH1DnQFEI1bVyfaEcmb5Lnq9gwzNhHno`


### ws 数据包格式
参考 [协议简介](https://github.com/huya-ext/miniapp/tree/master/examples/game-common-demo-a/server-java#%E5%8D%8F%E8%AE%AE%E7%AE%80%E4%BB%8B)
