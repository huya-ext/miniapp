### 游戏服务器demo简介

> 本游戏服务器基于netty websocket+json实现。

#### 代码结构

```
├── java
|   ├── com.huya.ig
│   │   ├── common      // 核心封装，开发者可以无需关注这部分代码，感兴趣的可以查阅源码
│   │   │   ├── huyaapi // 虎牙弹幕消息监听组件，提供回调接口，业务只需实现onMsg接口即可完成弹幕消息处理
│   │   │   ├── network // websocket网络层封装，提供网络回调接口，业务实现NetworkListener即可
│   │   │   ├── utils   // 通用工具类   
│   │   ├── game        // 游戏主逻辑，开发者重点关注和实现的部分
├── resources
|   ├── game.properties     // 服务配置定义文件
|   ├── logback.xml         // 日志配置文件
|   ├── start.sh            // 服务启动脚本
|   ├── stop.sh             // 服务停止脚本
```

其中每个模块下面的代码文件里面都有详细的注释。

#### 本地运行

在ide中运行`com.huya.ig.game.DemoMain`即可。

#### 代码编译

进入根目录执行`mvn clean package`即可。
编译后的程序在`\target\dist`目录，说明如下：

```
├── dist
│   ├── bin             // 服务启动、停止脚本
│   │   ├── start.sh    // 服务启动脚本                    
│   │   └── stop.sh     // 服务停止脚本
│   ├── conf        
│   │   ├── game.properties     // 服务配置文件
│   │   └── logback.xml         // 日志配置
│   ├── lib                     // 依赖库
│   │   ├── commons-codec-1.14.jar
│   │   ├── commons-lang3-3.9.jar
│   │   ├── gson-2.8.5.jar
│   │   ├── guava-20.0.jar
│   │   ├── jackson-annotations-2.10.3.jar
│   │   ├── jackson-core-2.10.3.jar
│   │   ├── jackson-databind-2.10.3.jar
│   │   ├── java-jwt-3.10.2.jar
│   │   ├── JumpServer-1.0-SNAPSHOT.jar
│   │   ├── logback-classic-1.2.3.jar
│   │   ├── logback-core-1.2.3.jar
│   │   ├── netty-all-4.1.30.Final.jar
│   │   ├── protobuf-java-3.5.1.jar
│   │   ├── protobuf-java-util-3.5.1.jar
│   │   └── slf4j-api-1.7.25.jar
│   └── logs                    // 日志文件目录
│       ├── demo_error.log
│       └── demo.log
```

#### 本地客户端/服务器联调

1. 参考`本地运行`部分启动本地服务器；
2. 客户端配置本地服务器ws连接串后启动，其中ws连接串格式为`ws://{本地ws服务器ip}:{本地ws服务器端口}/?jwt=xxxxxxx`，即连接串后面附加jwt参数；
3. 说明：ws连接串后面的jwt参数，在虎牙小程序中是由客户端封装的websocket client自动获取并追加上去的，无需客户端和服务器特别处理，在本地调试阶段，需要客户端手动指定带jwt参数的ws连接串；
4. 本地调试阶段，jwt的生成方法参考`CommonComponent.java`中`main`方法，分别生成主播端的jwt和若干个观众端的jwt，并提供给客户端同学配置ws连接串；
5. 客户端在连接时，先由主播客户单连接（主播连接自动创建游戏房间），然后观众端连接到游戏房间进行游戏。


附jwt生成代码：

```java
// 私钥，随意字符，注意需要跟game.properties中的secretKey一致
String secretKey = "test";
// 主播uid字符串，随意字符
String profileId = "zhubouid";
// 观众uid字符串，如果是生成主播端使用的jwt的话 userId跟profileId一致即可，生成观众使用的jwt则随意不同的字符串即可
String userId = "zhubouid";

Algorithm algorithm = Algorithm.HMAC256(secretKey);
Map<String, Object> headerClaims = new HashMap();
headerClaims.put("alg", "HS256");
headerClaims.put("typ", "JWT");

int now = (int)(System.currentTimeMillis()/1000);
String token = JWT.create()
        .withHeader(headerClaims)
        .withClaim("creator", "DEV")
        .withClaim("role", "P")
        .withClaim("profileId", profileId)
        .withClaim("extId", "")
        .withClaim("roomId", "1000")
        .withClaim("userId", userId)
        .withClaim("iat", now)
        .withClaim("exp", now+30*24*60*60)
        .withClaim("appId", "appId")
        .sign(algorithm);

System.out.println(token);
```

#### 协议简介

```javascript
协议封装：
{
	"protocol": int,
	"payload": "json string"
}

1. 连接
主播：ws://172.21.15.38:8080/?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTQ3NSwidXNlcklkIjoiemh1Ym91aWQiLCJpYXQiOjE1OTQ3ODM0NzUsInJvb21JZCI6IjEwMDAifQ.ECIai_PT03KLNXj6sPL82RqPd8CZKhiLglvMt-lwipo
玩家1：ws://172.21.15.38:8080/?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTQ5MCwidXNlcklkIjoiemh1Ym91aWQxIiwiaWF0IjoxNTk0NzgzNDkwLCJyb29tSWQiOiIxMDAwIn0.SYtTU8YEMQC1JUIjE2TUnvHKpSh5os6PjzZPJ9OlJ9k
玩家2：ws://172.21.15.38:8080/?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTUwMCwidXNlcklkIjoiemh1Ym91aWQyIiwiaWF0IjoxNTk0NzgzNTAwLCJyb29tSWQiOiIxMDAwIn0.ieYiZVOyw149BIM2QcTVgklSCN0QiTqON5fiBZvsDao
玩家3：ws://172.21.15.38:8080/?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTUxMCwidXNlcklkIjoiemh1Ym91aWQzIiwiaWF0IjoxNTk0NzgzNTEwLCJyb29tSWQiOiIxMDAwIn0.i3O-dJWTKQeb2Lpwl7kVs1XTRWnAtoXjyww_UMzRSLA
玩家4：ws://172.21.15.38:8080/?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTUyMSwidXNlcklkIjoiemh1Ym91aWQ0IiwiaWF0IjoxNTk0NzgzNTIxLCJyb29tSWQiOiIxMDAwIn0.1vsoyO8ApIZfPuEosohzF6Rhd0iLV5YGQXBNKh--f7U
	1). 房间已经结束关闭，对当前用户单播房间已结束
		{
			"protocol": 201,
			"payload": ""
		}
	2). 房间存在，对房间用户广播玩家进入
		{
			"protocol": 204,
			"payload": "{"uid":"sadsadsad", "gaming":false, "signedUp": false}"
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
			"payload": ""
		}
	报名成功响应包，房间广播玩家报名成功：
		{
			"protocol": 205,
			"payload": "{"success":true, "player":"{"uid":"1","nick":"昵称","avatar":"头像url"}"}"
		}	
	报名失败响应包，对当前报名用户单播报名失败：
		{
			"protocol": 205,
			"payload": "{"success":false}"
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
            "payload": "{"score": 1}"
        }		
    实时排行榜：
        {
            "protocol": 104,
            "payload": "[{"uid":"1","score":3},{"uid":"2","score":2},{"uid":"2","score":1}]" // 排行榜
        }       
5. 游戏结束(倒计时结束，或者主播主动请求结束游戏)
	当游戏时间达到配置的回合最大时间或者房主主动结束游戏后，服务器会自动结算排行榜并对房间玩家广播游戏结束消息
	主播主动结束游戏请求包：
	    {
            "protocol": 103,
            "payload": ""
        }	
	响应包：
		{
			"protocol": 203,
			"payload": "[{"uid":"1","score":3},{"uid":"2","score":2},{"uid":"2","score":1}]" // 排行榜
		}	
```