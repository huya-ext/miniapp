## 虎牙小游戏启动模板

### SDK

如果需要更新SDK 版本, 需要:
1. 更新 `./template/package.json` 里的内容
2. 更新 `./index.js` 的内容, 在 createLauncher 函数里返回对应的 SDK 版本号, 其中 kiwi 代表虎牙直播 APP, streamer 代表虎牙助手 APP


### 入口文件

如果需要不同的小程序使用不同的入口文件
1. 在 `./template` 下添加对应的入口文件
2. 更新 `./index.js` 的内容, 在 createLauncher 函数里返回小程序类型和入口文件的对应关系
