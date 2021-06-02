/*
#用于open api的js demon.
#我们使用windows终端运行js demon，生成jwt token.
第1步:如果没有安装node.js首先需要安装node.js(Node.js 安装包及源码下载地址为：https://nodejs.org/en/download/。)
       npm一般是随着node.js一起安装的，安装完可以node -v 和npm -v查看下。
       
第2步:快捷键 win+r 运行cmd进入到windows控制终端，cd到刚刚nodeJs的安装目录下执行npm install jwt-simple，安装jwt-simple jS库，安装完之后会发现
       刚刚node_modules目录下面多了一个jwt-simple文件夹，这就是库文件我可以查看其中js代码或者修改代码，我们查看这个库的代码就会发现jwt-simple库
       的head是固定的，默认是{"typ": "JWT","alg": "HS256"}。
       
第3步:安装完jwt-simple后编写如下示例代码保存JwtToken.js。

第4步:在window终端运行代码 node test_demo_openapi.js

*/

const dateTime = Date.now();
const timestamp = Math.floor(dateTime/1000);

'use strict'
var jwt = require('jwt-simple');
var WebSocket = require('ws');

//payload按照文档说明生成就好，此处只是一个范例
//你申请的开发者appId以及对应的secret
var appId = 'xxxxxxxxxxxxxx';
var secret = 'xxxxxxxxxxxxxxxxxxxxxx';

//监听的房间号
var roomId = 10005272;

var payload =
{
    "iat":timestamp,
    "exp":timestamp+600,    //此处看你具体需求，详情看文档
    "roomId":roomId, 
    "appId":appId
};


//生成token
var token = jwt.encode(payload, secret, 'HS256');
console.log(token);
console.log('\n');

//解码token，输出payload部分
//var decode = jwt.decode(token, secret);
//console.log(decode);
//console.log('\n');

var sUrl = "ws://ws-apiext.huya.com/index.html?do=comm&roomId=" + roomId + "&appId=" + appId + "&iat=" + timestamp + "&sToken=" + token;
console.log(sUrl);
console.log('\n');


//建立webSocket连接
var socket = new WebSocket(sUrl);

//在成功建立连接后，用于向服务器发送订阅通知消息以及取消订阅通知消息两种命令，同时保持与服务器的心跳，同一个websocket连接可以同时订阅多个消息
socket.onopen=function(event)
{
    //发送subscribeNotice command
    socket.send('{"command":"subscribeNotice","data":["getMessageNotice","getExpressionEmoticonNotice"],"reqId":"123456789","extUuid":"xxxxx"}');

    //设置定时器以文本数据发送ping，保持与服务器的心跳
    setInterval(function(){
        socket.send('ping');
    },15000);
};
 
//处理到来的信令 此处只是打印日志
socket.onmessage = function(event){
    //console.log('onmessage: ',event.data);
    var json = JSON.parse(event.data);
    if (json.statusCode == 200)
    {
        //TODO处理数据json.data
        if(json.notice == 'getMessageNotice')//弹幕通知数据
        {
            console.log('onmessage:getMessageNotice');
            console.log(json.data);
        }
        else if (json.notice == 'getExpressionEmoticonNotice')//大表情，梗
        {
            console.log('onmessage:getExpressionEmoticonNotice');
            console.log(json.data);
            console.log('detail info:');
            console.log(json.data.detail);
        }
        else if(json.notice == 'getSendItemNotice')//送礼通知数据
        {
            console.log('onmessage:getSendItemNotice');
            console.log(json.data);
        }
        else if(json.notice == 'getVipEnterBannerNotice')//高级用户进场通知数据
        {
            console.log('onmessage:getVipEnterBannerNotice');
            console.log(json.data);
        }
        else if(json.notice == 'getOnTVAwardNotice')//上电视弹幕中奖
        {
            console.log('onmessage:getOnTVAwardNotice');
            console.log(json.data);
        }
        else if(json.notice == 'getOpenNobleNotice')//开通续费贵族
        {
            console.log('onmessage:getOpenNobleNotice');
            console.log(json.data);
        }
        else if(json.notice == 'getOpenGuardianNotice')//开通续费守护
        {
            console.log('onmessage:getOpenGuardianNotice');
            console.log(json.data);
        }
		else if(json.notice == 'getUserMutedNotice')//房管禁言事件
		{
            console.log('onmessage:getUserMutedNotice');
			console.log(json.data);
		}
        else if(json.notice == 'getVipBarNotice')//贵宾席前100
        {
            console.log('onmessage:getVipBarNotice');
            console.log(json.data);
        }
        else if(json.notice == 'getConferVFansNotice')//授予钻粉
        {
            console.log('onmessage:getConferVFansNotice');
            console.log(json.data);
        }
        else if(json.notice == 'getOpenSuperFansNotice')//开通续费超粉事件通知
        {
            console.log('onmessage:getOpenSuperFansNotice');
            console.log(json.data);
        }
        else if(json.notice == 'getFansBadgeNotice')//首次获得粉丝徽章通知
        {
            console.log('onmessage:getFansBadgeNotice');
            console.log(json.data);
        }
        else if(json.notice == 'getAttendeeNotice')
        {
            console.log('onmessage:getAttendeeNotice');
            console.log(json.data);  
        }
        else if(json.notice == 'command')//发送command的回包数据
        {
            console.log('onmessage:command');
            console.log(json.data);
        }
        else
        {
            console.log('onmessage:error.');
            //TODO 错误notice处理
        }
    }
    else
    {
        //TODO 错误处理
    }
};