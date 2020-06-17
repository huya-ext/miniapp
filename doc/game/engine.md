## 虎牙小游戏引擎支持清单及对接流程

### 支持及推荐的引擎：
| 名称          | 类型     | 官网                                    | 支持2D | 支持3D  | 上手门槛 | 评价                                                         |
| ------------- | -------- | --------------------------------------- | ------ | ------  | -------- | ------------------------------------------------------------ |
| Cocos Creator | 游戏引擎 | [链接](https://www.cocos.com/creator)           | 是     | 是     | ★★★     | 2D游戏引擎，对新手来说有一定的学习门槛   |
| LayaBox        | 游戏引擎 | [链接](https://www.layabox.com/)                 | 是     | 是     | ★★★      | 2D/3D游戏引擎，对新手来说有一定的学习门槛 |
| 白鹭          | 游戏引擎 | [链接](https://egret.com/)                       | 是     | 是    | ★★★      | 2D/3D游戏引擎，对新手来说有一定的学习门槛 |
| PixiJS        | 渲染库   | [链接](https://github.com/pixijs/pixi.js)        | 是     | *否*     | ★★       | 基于WebGL的开源2D渲染引擎，学习门槛低，适合超轻量级2D小游戏开发 |
| Three.js      | 渲染库   | [链接](https://github.com/mrdoob/three.js)       | *否*      | 是     | ★★       | 基于WebGL的开源3D渲染引擎，学习门槛低，适合超轻量级3D小游戏开发 |
| Phaser 3      | 游戏引擎 | [链接](https://github.com/photonstorm/phaser)    | 是     | *否*      | ★★       | 基于WebGL的开源2D游戏引擎，相比PixiJS提供的游戏支持能力更强  |
> 以上只列举部分主流的H5游戏引擎，了解其它引擎可联系官方
---

### 各个引擎对接方式：

#### 准备工作

安装 nodejs 环境，版本:v10.x.x

安装 Python 3 环境

执行以下命令安装虎牙小程序CLI
```
npm install -g  @hyext/cli
```
---
#### LayaBox
1. 正常创建 LayaBox 项目, 并进行游戏逻辑开发
2. 在`.laya/web.json`文件中，添加一项:`"es6toes5": true`
3. 在需要与虎牙集成的时候，在 LayaBox 项目根目录执行命令: `npx hyext init  -b laya`, 选择终端类型的过程参考[快速开始](https://dev.huya.com/docs/#/./getting-started)

---

#### Cocos Creator
1. 正常创建 Cocos Creator 项目(**目前只支持 V2.2.2 及以下版本**), 并进行游戏逻辑开发
2. 在需要与虎牙集成的时候，在Cocos Creator 项目的`构建发布`菜单中，`发布平台`选项中选择 `Web Mobile`，路径使用默认的`./build`，**`MD5 Cache` 选项不要选中**
2. 在项目根目录执行命令: `npx hyext init -b h5game`, 选择终端类型的过程参考[快速开始](https://dev.huya.com/docs/#/./getting-started)，最后一步需要输入`h5Dir`，即H5游戏发布代码的相对路径，填写：`./build/web-mobile`

---

#### 白鹭（Egret）
1. 正常创建 Egret 游戏 项目, 并进行游戏逻辑开发
2. 在需要与虎牙集成的时候，点击Egret Wing 项目的`插件/Egret项目工具/发布Egret项目`菜单，在弹出框中选择 `HTML5`，版本号填`1.0`，并设为默认发布
2. 在项目根目录执行命令: `npx hyext init -b h5game`, 选择终端类型的过程参考[快速开始](https://dev.huya.com/docs/#/./getting-started)，最后一步需要输入`h5Dir`，即H5游戏发布代码的相对路径，填写：`./bin-release/web/1.0`

---

#### PixiJS,Three.js,Phaser 3等其它HTML5渲染引擎 + 不采用打包器 开发模式
1. 创建一个空`<project-name>`目录，在里面创建`h5`二级子目录
2. 在根目录下面执行命令：`npx hyext init  -b h5game`，选择终端类型的过程参考[快速开始](https://dev.huya.com/docs/#/./getting-started)，最后一步需要输入`h5Dir`，即H5游戏发布代码的相对路径，填写：`./h5`
3. 所有的 `html` `js` `image` 等代码及资源文件全部放在`h5`二级子目录里面

---

#### PixiJS,Three.js,Phaser 3等其它HTML5渲染引擎 + 打包器（webpack等） 开发模式
1. 创建一个空`<project-name>`目录，在里面创建`webpack`/`Parcel `/`browserify`等打包器支持的工程文件，以及源代码及资源文件，进行游戏逻辑开发
2. 在需要与虎牙集成的时候，执行 `npm run build`，生成H5游戏发布代码及资源到`dist`目录中
3. 在根目录下面执行命令：`npx hyext init  -b h5game`，选择终端类型的过程参考[快速开始](https://dev.huya.com/docs/#/./getting-started)，最后一步需要输入`h5Dir`，即H5游戏发布代码的相对路径，填写：`./dist`

---

#### 调试及打包上传
1. 需要在虎牙终端调试时，在项目根目录下面执行 `npx hyext start` 开启小游戏本地开发模式
2. 需要打包上传时，在项目根目录下面执行 `npx hyext release` 

---

#### 附录
  * [常见问题](./faq.md)   
