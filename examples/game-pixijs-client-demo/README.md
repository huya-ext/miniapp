## Pixi.js 小游戏demo

### 版权声明
基于[Pixi实例学习: 宝物猎人](https://github.com/Zainking/learningPixi#casestudy)修改

### 特别说明
此DEMO仅供参考,其中大部分代码仅为示例,并不完善,请勿用于正式发布.

### 截图
![](./ss.png)

![](./ss2.png)

### 文件结构说明
```
.
├── h5              //H5游戏发布文件目录
│   ├── audio       //游戏内用的音频
│   ├── component   //游戏组件
│   ├── images      //游戏内用的图片
│   ├── index.html  //web端游戏启动入口
│   ├── index.js    //游戏主逻辑文件  
│   ├── lib         //游戏引擎依赖库
│   └── util.js     //游戏工具类js
├── package.json    //虎牙小程序构建依赖配置
└── project.config.json //虎牙小程序配置文件

```
### 运行方式

安装 nodejs 环境，版本:v10.x.x

安装 Python 3 环境

执行以下命令安装虎牙小程序CLI
```
npm install -g  @hyext/cli
```
`npm install` 安装Node.js依赖模块.

在[ext.huya.com](https://ext.huya.com/)创建小程序(参考[创建小程序](https://dev.huya.com/docs/#/ems?id=_1-%e5%88%9b%e5%bb%ba%e5%b0%8f%e7%a8%8b%e5%ba%8f))

#### 开发版本运行
`npx  hyext start` 启动本地开发服务.

打开开发者中心([ext.huya.com](https://ext.huya.com/)),按提示手动上传本地`hyext_dist/build-result`目录下的开发配置文件(参考[小程序开发](https://dev.huya.com/docs/#/hyext-cli?id=%e5%bc%80%e5%8f%91)),即可在虎牙app或者pc主播端启动游戏.

#### 测试版本运行

执行 `npx hyext release` 打包小游戏代码，然后上传到虎牙小程序平台，参考[程序配置](https://dev.huya.com/docs/#/ems?id=_232-%e7%a8%8b%e5%ba%8f%e9%85%8d%e7%bd%ae)进行测试

### 功能点
1. Pixi游戏能力

2. 多分辨率适配

3. 按钮实现

4. 虚拟摇杆实现

5. 虎牙小程序API调用

6. 音效播放

### 使用位图字体说明
1. Pixi.js使用自定义位图字体，可以使用Pixi的加载器来加载XML位图文件，就像你加载JSON或图片文件一样，然后再结合PIXI.BitmapText使用即可，可参考示例demo/myFont_demo.html。
2. 建议使用位图字体制作工具Bitmap Font Generator：http://www.angelcode.com/products/bmfont/
3. bmfont的使用方法可参考：https://blog.csdn.net/u013654125/article/details/78672809