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


### 协议简介

```javascript
协议封装：
{
	"protocol": int,
	"payload": "json string"
}

1. 连接
主播A（创房）：ws://172.21.15.38:9090/ws/?jwt=xxx
主播B（加入）：ws://172.21.15.38:9090/ws/?pk_room_id=1234&jwt=xxx

玩家1（来自于主播A的直播间）：ws://172.21.15.38:9090/?jwt=xxx
玩家2（来自于主播B的直播间）：ws://172.21.15.38:9090/?jwt=xxx


	1). 房间已经结束关闭，对当前用户单播房间已结束
		{
			"protocol": 201,
			"payload": ""
		}
	2). 房间存在，单播玩家进入
		{
			"protocol": 204,
      "payload": 
      "{\"uid\": \"20001\", \"gaming\": false, \"signedUp\": false"
		}	

2. 心跳包			
	连接成功之后，客户端应该定时每隔3秒上报一次心跳包
	心跳请求包：
		{
			"protocol": 100,
			"payload": "{"timestamp": 21312312}"
		}
	心跳响应包：
		{
			"protocol": 200,
			"payload": "{"timestamp": 21312312}"
		}		

3. 报名
	请求包：
		{
			"protocol": 101,
			"payload": "{"nick":"昵称","avatar":"头像url"}"
		}
	报名成功响应包，单播玩家报名成功：
		{
			"protocol": 205,
			"payload": "{"success":true, "player":"{"uid":"1","nick":"昵称","avatar":"头像url"}"}"
		}	
	报名失败响应包，对当前报名用户单播报名失败：
		{
			"protocol": 205,
			"payload": "{"success":false}"
		}	

    组队信息广播：
    {
      "protocol": 207,
     "payload": "{\"teams\": [{\"roomId\": \"15687938\", \"players\": [{\"uid\": \"20000\", \"score\": 0, \"nick\": \"\\u6635\\u79f0\", \"avatar\": \"\\u5934\\u50cfurl\", \"isPresenter\": false}], \"presenter\": {\"uid\": \"10000\", \"score\": 0, \"nick\": \"\\u6635\\u79f0\", \"avatar\": \"\\u5934\\u50cfurl\", \"isPresenter\": true}}, {\"roomId\": \"15687939\", \"players\": [{\"uid\": \"20001\", \"score\": 0, \"nick\": \"\\u6635\\u79f0\", \"avatar\": \"\\u5934\\u50cfurl\", \"isPresenter\": false}], \"presenter\": {\"uid\": \"10001\", \"score\": 0, \"nick\": \"\\u6635\\u79f0\", \"avatar\": \"\\u5934\\u50cfurl\", \"isPresenter\": true}}]}"
    }

4. 开始游戏
	当报名玩家人数达到游戏配置的最低参与人数时，房主可以请求开始游戏
	请求包：
		{
			"protocol": 102,
			"payload": ""
		}	
	响应包，开始成功之后，对房间玩家广播：
		{
			"protocol": 202,
			"payload": ""
		}

5. 玩家上报游戏得分
    游戏开始后，玩家实时上报得分
    请求包：
        {
            "protocol": 104,
            "payload": "{\"score\": 1}"
        }		
    实时排行榜：
        {
            "protocol": 104,
            "payload": "[{"roomId":"1","score":3},{"roomId":"2","score":2}]" // 排行榜
        }    

6. 游戏结束 (倒计时结束，或者主播主动请求结束游戏)
	当游戏时间达到配置的回合最大时间或者房主主动结束游戏后，服务器会自动结算排行榜并对房间玩家广播游戏结束消息
	主播主动结束游戏请求包：
	    {
            "protocol": 103,
            "payload": ""
        }	
	响应包：
		{
			"protocol": 203,
      "payload": "[{"roomId":"1","score":3},{"roomId":"2","score":2}]" // 排行榜

		}	
```

---

# 线上发布部署

linux下面，进入src目录执行：`nohup python3 main.py &`

日志会输出到`nohup.out`文件中