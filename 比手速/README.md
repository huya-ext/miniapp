

![](https://v-cms-img.huya.com/huya/hy-ext/logo.png)

本文档将以 ```比手速```小程序为例，讲解虎牙小程序的开发流程。

注：可在阅读此文档前先安装体验```比手速```小程序，更有助于理解本文档的内容。

# 目录 
- [创建小程序](#创建小程序)  
- [前端开发调试](#前端开发调试) 
- [后台流程](#后台流程)  
- [上传到测试版](#上传到测试版)  
- [提交审核](#提交审核)  
- [发布](#发布)  


# 创建小程序
- 在小程序管理后台创建您的小程序。首先为您的小程序起一个名字，点击```确定```后虎牙小程序即生成：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/2.png)

 <br/>

- 小程序ID将在小程序调用后台服务时使用，请妥善保存。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/1.png)

 <br/>
 
- 另外，在小程序管理后台可以查看开发者信息（点击```头像```即可查看），如下信息将在小程序后台鉴权验证时使用。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/3.png)

# 前端开发调试
虎牙小程序需要使用官方提供的[```脚手架```](https://github.com/huya-ext/miniapp/wiki/%E8%84%9A%E6%89%8B%E6%9E%B6)进行开发，同时提供了[```调试工具```](https://github.com/huya-ext/miniapp/wiki/Web%E5%BC%80%E5%8F%91%E8%B0%83%E8%AF%95)来帮忙您进行开发调试。在进行开发之前，建议您先对虎牙小程序的形态有所了解，点击[```此处```](https://github.com/huya-ext/miniapp/wiki/%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97)了解更多。

## 脚手架
提示：如果您已安装了最新版本的脚手架，可以跳过此部分。

### 安装nodejs
- 首先确保配置了 [```node.js```](https://nodejs.org/zh-cn/)的环境以及对[```npm```](https://www.npmjs.com/)或者[```yarn```](https://yarnpkg.com/zh-Hant/)有简单的了解；如不了解，可以通过[```这里```](https://www.npmjs.cn/)先简单学习。

### 安装hyext
- 安装好了```node.js```之后，在终端执行下面的命令安装脚手架：
> npm i –g hyext

### 新建项目
安装完成之后，即可新建自己的项目了。

按照目前虎牙小程序的架构，pc端（包含web观众端和pc开播端）和移动端（app观众端和虎牙助手开播端）的项目是分开的，所以在新建的时候可以选择pc端的框架(vue, react, jquery) 或者移动端的框架（react native）。

- 打开终端，输入您的小程序的名称，执行以下命令:
> hyext init yourHyAppName

- ```比手速```的pc端选择了vue，如下图所示。输入上述命令后，回车执行等待包下载完成：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/4.png)

 <br/>
 
- 【注】移动端的安装应如下图所示：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/5.png)

 <br/>
新建好项目之后就可以进行开发工作了。


## PC端代码讲解

- 如果您的应用同时拥有pc主播端和web观众端，可以按如下图所示的目录组织代码：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/6.png)

### 样式适配
- 建议设计师采用iphone6 的设计稿，在前端进行开发的时候使用工具函数进行转换。如下图所示（scss版本）：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/7.png) ![](https://v-cms-img.huya.com/huya/hy-ext/speed/8.png)

### pc端代码调试
#### 观众端代码调试
  
- 在终端执行```hyext run dev```命令，可以跑起来web观众端的代码。借助小程序web端调试工具里查看页面UI布局或者进行调试。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/9.png)

- 在调试工具上填写小程序的路径，路径为web观众端入口(上图文件目录里的user.html)地址，即可开始调试。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/10.png)

 <br/>
 
- 如果当前的小程序需要使用到后台接口，可以选择接口是否经过EBS代理。如果勾选了是，则请求会经过虎牙的EBS服务中转后返回到前端。如果勾选了否，则会直接调用当前小程序后台的接口，不经过平台的EBS服务代理。注意，如果选择不经过平台的EBS服务代理，则需要自己的后台支持跨域，可选择让后台支持cors。
 
 <br/>

#### PC主播端调试

- 首先要下载pc端的调试工具，下载安装完成之后，打开调试工具：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/11.png)

- 执行```hyext run dev```跑起来之后的项目后，把小程序路径输入到开发工具中，点击加载。其他配置和web端调试工具类似。

### 代码逻辑讲解
#### pc主播端（Vue版本）

- 首先在```hyExt sdk```加载完毕后，调用```hyExt.requestEbs```方法请求后台接口获取有哪些可用的模板数据，并调用```hyExt.observer.on```方法注册对比手速结果推送的监听。主播可以在小程序中配置比手速的信息，然后保存该配置，调用```saveSettingConfig```函数，在该函数中执行校验逻辑，并对一些特殊字符进行转义，防止xss问题。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/12.png)


- 在主播保存了之后，会向用户端推送主播保存的配置，主播可以选择开启本场活动。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/13.png)

- 点击启动之后，会开启准备时间的倒计时，在3s的准备时间结束之后，会继续主播设置的活动时间的倒计时，在此期间，直播间的观众可以在观众端进行操作，当活动时间倒计时结束后，后台需要一定的时间来汇总结果，前端要等待结果汇总完毕的推送通知， 然后再根据场次id来调用后台接口来获取比赛结果。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/14.png)

- 【注意】因为目前平台限制推送的内容大小不超过5kb, 所以要当推送内容大小超过限制时，可能要换用其他方案。比如说只在推送内推送关键信息，然后通过关键信息再调用后台接口获取数据。

#### web观众端（Vue版本）

- 当观众进入小程序时，会先获取当前上一场的比赛结果，并且注册对推送的监听以及获取用户的头像，昵称等用户信息。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/15.png)

- 如下图所示，在观众端有三个对推送的监听，包括对主播保存配置，主播启动比赛以及比赛结束时的结果的监听。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/16.png)

- 当主播保存了配置，观众端会切换成主播配置的内容，当主播开启了活动，观众即可进行点击，选择自己想要选择选项。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/17.png)

- 当活动时间倒计时结束，会主动上报用户的点击结果。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/18.png)

- 当上报用户的点击结果后，等待后台推送比赛结束的通知，上文有提到因为推送内容大小的限制，这里采用根据场次id来获取比赛结果。


## App端代码讲解

- App端代码目录如下图所示：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/19.png)

### 移动端尺寸适配

- 建议设计师采用iphone6的设计稿，然后通过工具函数把量到的尺寸转成dp。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/20.png)


### 代码讲解
#### app观众端

app观众端的逻辑和web观众端逻辑类似，下面只做简要介绍。

- 执行对推送的监听。当收到主播端的配置推送的时候，观众端会更新显示主播的配置。当倒计时开始时，观众可以点击选择不同的选项，倒计时结束后，会统计观众的点击结果，并上报至后台统计。当后台汇总统计之后，再展示最终的结果。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/21.png)

#### 虎牙助手主播端
助手主播端和pc主播端的逻辑一致，下文只做简要介绍。

- 在sdk加载完成后，先获取模板的数据和注册对推送的以及自定义事件的监听。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/22.png)

- 获取数据后，传递给子组件。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/23.png)

# 后台流程

后台搭建过程：
1. 有一台外网可访问的服务器（小程序大赛队伍推荐使用阿里云，可下载[pdf](https://cmsstatic.huya.com/hy-ext/%E8%99%8E%E7%89%99%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%8A%80%E6%9C%AF%E6%8C%91%E6%88%98%E8%B5%9B-%E9%98%BF%E9%87%8C%E4%BA%91%E4%BD%BF%E7%94%A8%E9%A1%BB%E7%9F%A5.pdf)查看阿里云申请规则）；
2. 后台服务正常启动且可接收http请求；
3. 解析请求参数，校验JWT（[具体文档地址](https://github.com/huya-ext/miniapp/wiki/%E7%BB%9F%E4%B8%80%E9%89%B4%E6%9D%83%E8%AF%B4%E6%98%8E）)） ；
4. 处理业务逻辑并返回响应。

 <br/>
 
以比手速为例：
- 后台返回所有场景的可选项给前端；
- 主播点击保存按钮，前端将配置以HTTP接口提交至后台；
- 后台接收到请求后，解析请求参数，校验JWT后将配置写入数据库，推送广播至直播间（[文档](https://github.com/huya-ext/miniapp/wiki/deliverRoomByProfileId)），然后返回响应；
- 点击启动时，前端提交请求至后台，后台更新场次配置状态，推送广播至直播间然后返回响应；
- 场次接收后，后台统计出排行榜，并推送广播至直播间及推送单播至主播（[文档](https://github.com/huya-ext/miniapp/wiki/deliverByProfileId)）需要注意：广播及单播接口推送的消息都有大小限制，所以不适合将整个排行榜推送，因此只推送场次ID，前端接收到推送后根据ID调用一个HTTP接口获取排行榜信息。

# 上传到测试版
- 当开发完毕之后，可以上传代码到测试版。上传之前需要在移动端项目和pc端项目下执行```hyext release```命令，执行完毕后会生成app和web目录。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/24.png)

![](https://v-cms-img.huya.com/huya/hy-ext/speed/25.png)

- 把app文件夹和web文件夹挪至同一目录下，并压缩。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/26.png)

- 在小程序后台选择好终端类型，并填写应用名（app端）和入口地址（pc端）:

![](https://v-cms-img.huya.com/huya/hy-ext/speed/27.png)

- 对于app端来说，应用名即为调用```AppRegistry.resiterComponent```注册的应用名。如下图所示：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/28.png)

![](https://v-cms-img.huya.com/huya/hy-ext/speed/29.png)

- 对于pc端来说，入口地址即为页面地址，分别为```anchor.html```和```user.html```

![](https://v-cms-img.huya.com/huya/hy-ext/speed/30.png)

- 然后上传代码压缩包：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/31.png)

- 并将自己的测试账号添加到访问主播白名单和观众白名单：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/32.png)


- 设置完毕，即可从开发版本提交至测试版本，就会进行构建。构建成功后，即可让在内测版本主播白名单的主播安装此小程序的测试版。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/33.png)

![](https://v-cms-img.huya.com/huya/hy-ext/speed/34.png)

- 安装成功后，即可进入此主播的直播间内访问该小程序的测试版。
（注意，只有在登录状态下且账号在后台设置的白名单的用户才能在主播直播间看到测试版小程序。）

![](https://v-cms-img.huya.com/huya/hy-ext/speed/35.png)

- 另外，一些其他的信息也是需要在测试版设置的，以便主播能够更多的了解您的小程序，提升您的小程序的安装量。

![](https://v-cms-img.huya.com/huya/hy-ext/speed/36.png)

# 提交审核
当测试完毕后，即可提交小程序至测试版本：

![](https://v-cms-img.huya.com/huya/hy-ext/speed/37.png)

当提交审核后，虎牙小程序团队会尽快审核您的小程序并告知您审核结果。

# 发布
当审核版本审核通过后，即可发布当前版本。成功发布之后，主播即可通过该小程序在商店中的链接进行安装使用。
