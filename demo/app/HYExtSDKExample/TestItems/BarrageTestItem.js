import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class BarrageTestItem extends TestItemBase {
    constructor(props){
        super(props);
        this._title = "弹幕";
        this._callback = this._callback.bind(this);
        this._callback2 = this._callback2.bind(this);
        this.state = {
            hasObserver:false,
            hasObserverSubmit:false
        }
    }

    _onPress1() {
        hyExt.logger.info("引导发言");
        hyExt.context.leadBarrage().then(() => {
            let str = '引导发言成功';
            hyExt.logger.info(str);
            this.showText(str); 
        }).catch(err => {
            this.showText("引导发言失败："+JSON.stringify(err));
        })
    }

    _onPress2() {
        this.setState(previousState => {
            if(previousState.hasObserverSubmit) {
                hyExt.logger.info("取消监听发言");
                hyExt.context.off("barrageSubmit",this._callback2);
            } else {
                hyExt.logger.info("监听发言:");
                hyExt.context.on("barrageSubmit",this._callback2);
            }
            return { hasObserverSubmit: !previousState.hasObserverSubmit};
          });
    }
    _onPress3() {
        let opt = {};
        if(this._userNick && this._userNick.length) {
            opt.sendNick = this._userNick;
        }

        if(this._content && this._content.length) {
            opt.content = this._content;
        }

        if(this._fansLevel && this._fansLevel.length) {
            opt.fansLevel = parseInt(this._fansLevel);
        }

        if(this._level && this._level.length) {
            opt.nobleLevel = parseInt(this._level);
        }

        this.setState(previousState => {
            if(previousState.hasObserver) {
                hyExt.logger.info("取消监听发言:",JSON.stringify(opt));
                hyExt.context.offBarrageChange(this._callback);
            } else {
        hyExt.logger.info("监听发言:",JSON.stringify(opt));
        hyExt.context.onBarrageChange(opt, this._callback);
            }
            return { hasObserver: !previousState.hasObserver};
          });
    }

    _callback(content) {
        hyExt.logger.info("recive gift message:",JSON.stringify(content));
        this.showText("收到弹幕消息："+JSON.stringify(content));
    }

    _callback2(content) {
        hyExt.logger.info("recive gift message:",JSON.stringify(content));
        this.showText("收到发言消息："+JSON.stringify(content));
    }
    contentView() {
        let title = this.state.hasObserver ? "取消监听":"监听弹幕";
        let title2 = this.state.hasObserverSubmit ? "取消监听":"监听发言";
        return (
            <View
               style = {{left:15,right:15,height:this.contentViewHeight()}}
            >
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>用户昵称: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._userNick = text}}
                     placeholder={'请输入需要监听的弹幕用户昵称'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>弹幕内容: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._content = text}}
                     placeholder={'请输入需要监听的弹幕内容关键字'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>粉丝等级: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._fansLevel = text}}
                     placeholder={'请输入需要监听的粉丝等级'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>最小用户等级: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._level = text}}
                     placeholder={'请输入需要监听的最小用户等级'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onPress1.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>引导发言</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onPress2.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>{title2}</Text>
                    </View>
                 </TouchableOpacity>
                  <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onPress3.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>{title}</Text>
                    </View>
                 </TouchableOpacity>
               </View>
            </View>
        );
    }

    contentViewHeight() {
        return 200;
    }
    
}
