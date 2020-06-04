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

---
> 更多小游戏开发资料,请查阅: [小游戏开发文档](https://github.com/huya-ext/miniapp/blob/master/doc/game.md)