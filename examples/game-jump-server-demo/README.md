### 跳一跳游戏服务器简介

> 本游戏服务器基于netty websocket+protobuf技术实现。

#### 代码结构

```
├── java
|   ├── com.huya.ig
│   │   ├── config      // 服务配置
│   │   ├── jump        // 游戏主逻辑
│   │   ├── network     // 网络层封装
│   │   ├── util        // 工具类
├── resources
|   ├── game.properties     // 服务配置定义文件
|   ├── jump.proto          // 游戏协议定义
|   ├── gen_code.bat        // protobuf代码生成windows脚本，unix系统可参考
|   ├── logback.xml         // 日志配置文件
|   ├── start.sh            // 服务启动脚本
|   ├── stop.sh             // 服务停止脚本
```

其中每个模块下面的代码文件里面都有详细的注释。

#### 本地运行

在ide中运行`com.huya.ig.JumpServerMain`即可。

#### 代码编译

进入根目录执行`mvn clean package`即可。
编译后的程序在`\target\dist`目录，说明如下：

```
├── dist
│   ├── bin             // 服务启动、停止脚本
│   │   ├── start.sh    // 服务启动脚本                    
│   │   └── stop.sh     // 服务停止脚本
│   ├── conf        
│   │   ├── game.properties     // 服务配置文件
│   │   └── logback.xml         // 日志配置
│   ├── lib                     // 依赖库
│   │   ├── commons-codec-1.14.jar
│   │   ├── commons-lang3-3.9.jar
│   │   ├── gson-2.8.5.jar
│   │   ├── guava-20.0.jar
│   │   ├── jackson-annotations-2.10.3.jar
│   │   ├── jackson-core-2.10.3.jar
│   │   ├── jackson-databind-2.10.3.jar
│   │   ├── java-jwt-3.10.2.jar
│   │   ├── JumpServer-1.0-SNAPSHOT.jar
│   │   ├── logback-classic-1.2.3.jar
│   │   ├── logback-core-1.2.3.jar
│   │   ├── netty-all-4.1.30.Final.jar
│   │   ├── protobuf-java-3.5.1.jar
│   │   ├── protobuf-java-util-3.5.1.jar
│   │   └── slf4j-api-1.7.25.jar
│   └── logs                    // 日志文件目录
│       ├── jump_error.log
│       └── jump.log
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

---
> 跳一跳游戏-前端DEMO: [链接](https://github.com/huya-ext/miniapp/tree/master/examples/game-jump-client-demo)

> 更多小游戏开发资料,请查阅: [小游戏开发文档](https://github.com/huya-ext/miniapp/blob/master/doc/game.md)