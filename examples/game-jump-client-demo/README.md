## 虎牙小游戏前端DEMO介绍
### 运行截图
![pc端](./screenshot/pc.jpg)

pc端

![pc端](./screenshot/pc2.jpg)

pc端

![手机端](./screenshot/mobile.jpg)

手机端

### 文件结构说明
```
├── README.md 
├── babel.config.js       //H5游戏源码配置
├── dist                  //H5游戏构建输出的目录
├── package.json          //H5游戏构建配置+虎牙小程序构建依赖配置
├── project.config.json   //虎牙小程序配置文件
├── public                //H5游戏源码目录
├── src
│   ├── jump              //H5游戏源码目录
│   ├── pb                //pb协议配置目录
│   ├── wss               //websockets逻辑
│   └── main.js           //入口文件
└── vue.config.js         //H5游戏源码配置
```

`dist` 是H5游戏构建输出的目录

### H5游戏构建

1. `node -v` 查看Node.js版本号,要求 `v10.xx.x` 版本.
2. `npm install` 安装Node.js依赖模块.
3. `npm run build` 构建H5游戏,成功后,会在 `dist` 目录下生成:
   
    ```
       ├── favicon.ico
       ├── index.html
       └── js
    ```
### 创建小程序
在[ext.huya.com](https://ext.huya.com/)创建小程序(参考[创建小程序](https://dev.huya.com/docs/#/ems?id=_1-%e5%88%9b%e5%bb%ba%e5%b0%8f%e7%a8%8b%e5%ba%8f)).
`npm install -g  @hyext/cli` 安装小程序cli

### 本地开发
1. `npx  hyext start` 启动本地开发服务.
2. 打开开发者中心([ext.huya.com](https://ext.huya.com/)),按提示手动上传本地`hyext_dist/build-result`目录下的开发配置文件(参考[小程序开发](https://dev.huya.com/docs/#/hyext-cli?id=%e5%bc%80%e5%8f%91)),即可在虎牙app或者pc主播端启动游戏.

### 本地联调websockets
1. 建议前端本地服务与服务端本地服务在同一局域网下启动，服务端生成调试jwt给前端使用，其中ws连接串格式为ws://{本地ws服务器ip}:{本地ws服务器端口}/?jwt=xxxxxxx，即连接串后面附加jwt参数.
2. 多人游戏模式区分主播测和用户测，游戏房只能由主播创建并开始，修改入口文件main.js其中__isAnchor全局变量主播为true，用户为false；__userName也可自定义，此变量作为本地联调使用.
3. 修改wss->index.js其中(ws://{本地ws服务器ip}:{本地ws服务器端口}/?jwt=xxxxxxx)，jwt写死为第一点服务端生成的jwt即可，注意区分主播测和用户侧
4. 建议拷贝多一个此工程作为副本作为联调使用，一个工程作为主播端，另一个作为用户端.

### 测试版本
1. 测试版本不依赖本地服务,会以离线包的形式下载及运行游戏,更方便小范围测试体验.
2. `npx  hyext release` 打包.
3. 打开开发者中心([ext.huya.com](https://ext.huya.com/)),按提示把`hyext_release`目录下的压缩包上传(参考[小程序打包](https://dev.huya.com/docs/#/hyext-cli?id=%e6%89%93%e5%8c%85)),即可在虎牙app或者pc主播端以测试版本模式启动游戏.
4. 如果要发给其它用户体验,需要根据虎牙号开通白名单.

### pb协议
1. protobuf.js是纯JavaScript实现，具有对Node.js和浏览器的TypeScript支持。它易于使用，速度极快，并且可以使用.proto文件立即使用！(参考github地址(https://github.com/protobufjs/protobuf.js))
2. .proto文件转.json文件可参考命令(pbjs -t json ./src/pb/jump.proto > ./src/pb/jump.json)

---
> 跳一跳游戏-后端DEMO: [链接](https://github.com/huya-ext/miniapp/tree/master/examples/game-jump-server-demo)

> 更多小游戏开发资料,请查阅: [小游戏开发文档](https://github.com/huya-ext/miniapp/blob/master/doc/game.md)
