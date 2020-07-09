# 虎牙小游戏开发指南
## 小游戏与虎牙小程序的关系

虎牙小游戏隶属于虎牙小程序，是虎牙小程序的游戏能力扩展。

小游戏注册、管理、发布流程与小程序完全一致，全部在[虎牙小程序开发者中心](http://ext.huya.com/)进行。

小游戏能使用所有小程序提供的能力，也支持在 Web、PC、Mobile 多终端下运行。

小游戏前端技术相对小程序增加了H5游戏加载及运行能力。

---

## 小游戏前端技术
虎牙小游戏的前端开发语言是 JavaScript。

### 一些限制
在虎牙APP端，小游戏运行在一套Runtime之上，Runtime提供了对WebGL 1.0 的支持。它不同于浏览器环境，没有提供完整的BOM和DOM支持，仅支持少量必要的接口，如：
```html
document.createElement
document.body.appendChild
window.innerWidth
window.innerHeight
...
```

### 引擎支持
开发者可以采用开发HTML5游戏方式(基于WebGL)来开发小游戏，支持使用`Cocos Creator`、`Egret`、`Laya`等游戏引擎开发，导出`HTML5`格式(web mobile)；也支持使用`Three.js`、`PixiJS`等HTML5渲染引擎直接开发，详情可查阅[虎牙小游戏引擎支持清单及对接流程](./game/engine.md)

> **注意，不支持使用 `SVG`、`DOM`、`CSS` 方式开发游戏，所有游戏画面及元素必须在 `Canvas` 中绘制**

### 音频播放
暂未支持 Web Audio。
支持使用HTML audio Element方式创建及播放音频。
```
var x = document.createElement("audio");
x.setAttribute("src", "xxxx.mp3");
x.play();
```
如果要循环播放，需要设置：
`x.setAttribute("loop", true);`

### 文字输入
文字输入框需要在游戏里面自行绘制，下面的代码只是用来弹出键盘、收起键盘，以及获取输入文字
```
var x = document.createElement("input");
x.setAttribute("type", "text");
//监听输入结果：
x.setAttribute("onchange", (event) =>{});

//弹出键盘：
x.focus();

//关闭键盘：
x.blur();
```

### 小程序API调用
所有小程序前端的API和能力，在虎牙小游戏内都可以调用。

> 小游戏的运行环境中已经自动注入了虎牙小程序的SDK，所以小游戏代码中**不再需要导入小游戏SDK**，可以直接在js代码中调用`hyext`中的各端API。

> 为了解决H5游戏单独编译时可能出现`hyext`未定义的问题，在小游戏中可使用`window['hyExt']`的方式调用小程序API

### WebSocket支持
小游戏前端提供了一个经过虎牙代理的WebSocket支持，API为`hyExt.WebSocket`。使用方式与标准的WebSocket类似。
例如：
```html
let ws = new window['hyExt'].WebSocket(wsUrl);

//websocket连接所传输二进制数据的类型,只支持“arraybuffer”
ws.binaryType = "arraybuffer";

ws.onmessage = function (event) {}
ws.onopen = function (event) {}
ws.onerror = function (event) {}
ws.onclose = function (event) {}
...
ws.send("test data");

```
> `hyExt.WebSocket` 支持文本消息及二进制消息，可以传输Json、Protocol Buffer、私有协议等。

> 调用`let ws = new window['hyExt'].WebSocket(wsUrl)`时，虎牙代理会自动在原始的wsUrl的末尾追加参数`jwt=xxx`，即用户的鉴权token，方便游戏服务器来鉴权及获得用户ID，jwt的用法参考[统一鉴权说明](https://dev.huya.com/docs#/%E7%BB%9F%E4%B8%80%E9%89%B4%E6%9D%83%E8%AF%B4%E6%98%8E)

> `hyExt.WebSocket` 支持发送和接收的最大单个message为64k

> 使用 `hyExt.WebSocket` 需要发送邮件到 `hy-ext@huya.com` 申请开通权限，附上小程序ID及名称

### HTTP支持
基于安全性原因，小游戏对`XMLHttpRequest`的使用进行了限制，目前只允许通过`XMLHttpRequest`访问以下域名：
```
hyext.com
msstatic.com  
huyaimg.dwstatic.com  
```

#### 加载用户头像
`XMLHttpRequest`允许访问的域名中包括虎牙用户头像所在域名，所以可以用`XMLHttpRequest`来加载用户头像二进制数据。

#### HTTP请求访问游戏服务器
如果要通过HTTP请求访问游戏服务器，由于游戏服务器不在`XMLHttpRequest`允许访问的范围内，需要通过小程序提供的统一网络请求API:[hyExt.request](https://dev.huya.com/docs/#/sdk/hyExt.request)
###

---

## 小游戏后端技术

小游戏后端开发语言不限，包括：Java、NodeJS、C++等都支持。

游戏前后端通信尽量使用WebSocket方式。

---

## 小游戏开发流程

小游戏注册、管理、发布流程全部在[虎牙小程序开发者中心](http://ext.huya.com/)进行，与小程序完全一致。


### 小游戏工程创建

参考小程序的[快速开始](https://dev.huya.com/docs/#/./getting-started)搭建开发环境

创建一个空`<project-name>`目录，在里面创建`<h5game-name>`二级子目录

在`<project-name>`目录下面执行命令：
```
npm install -g  @hyext/cli
npx hyext init  -b h5game
```

> 选择终端类型的过程参考[快速开始](https://dev.huya.com/docs/#/./getting-started)

> 最后一步需要输入`h5Dir`，即H5游戏发布代码的相对路径，本例为：`<h5game-name>`

创建完成之后的目录结构类似如下：
```
├── <h5game-name>
├── package.json
└── project.config.json
```

其中`<h5game-name>` 是H5游戏发布代码的目录。

无论我们是用什么游戏引擎或者渲染引擎开发游戏，最终需要将游戏编译或导出成H5格式，并放到`<h5game-name>` 目录下面。

### 小游戏开发测试过程
#### 本地开发调试
> 在H5游戏开发过程中，为了提高效率，可先按照独立H5游戏的方式来开发调试，先不集成到虎牙终端中，涉及到虎牙小程序SDK调用的部分，可采用mock的方式来模拟。

在游戏主要逻辑开发完成之后，需要集成到虎牙终端中运行测试时，先在虎牙小程序平台创建版本，参考[版本管理](https://dev.huya.com/docs/#/ems?id=_2-%e7%89%88%e6%9c%ac%e7%ae%a1%e7%90%86)

然后在项目根目录下面执行：`npx hyext start`  开启小游戏本地开发模式。

小游戏本地开发模式与小程序的[开发调试](https://dev.huya.com/docs/#/dev-guide?id=%e5%bc%80%e5%8f%91%e8%b0%83%e8%af%95)流程一致。

小游戏本地开发模式中，本地目录`<h5game-name>`下的发布代码如果有变更，**退出并重进直播间** 可以生效。

同时，小游戏本地开发模式 **不支持游戏H5代码断点调试**。


#### 版本测试

小游戏版本开发完毕后，可提交测试。
执行 `npx hyext release` 打包小游戏代码，然后上传到虎牙小程序平台。
参考[程序配置](https://dev.huya.com/docs/#/ems?id=_232-%e7%a8%8b%e5%ba%8f%e9%85%8d%e7%bd%ae)进行测试

#### 版本发布
与小程序一致，参考[版本发布](https://dev.huya.com/docs/#/ems?id=_26-%e7%89%88%e6%9c%ac%e5%8f%91%e5%b8%83)

---
## 附录
  * [常见问题](./game/faq.md)   
  * [虎牙小游戏引擎支持清单及对接流程](./game/engine.md)
  * [小游戏美术设计工具及流程介绍](./game/design.md)
  * [跳一跳游戏-前端DEMO](https://github.com/huya-ext/miniapp/tree/master/examples/game-jump-client-demo)
  * [跳一跳游戏-后端DEMO](https://github.com/huya-ext/miniapp/tree/master/examples/game-jump-server-demo)

