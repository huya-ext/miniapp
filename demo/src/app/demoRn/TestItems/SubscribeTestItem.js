import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class SubscribeTestItem extends TestItemBase {
    constructor(props){
        super(props);
        this._title = "订阅";
        this._callback = this._callback.bind(this);
        this.state = {
          hasObserver:false
      }
    }

    _onPress1() {
        hyExt.context.getSubscribeInfo().then(isSubscribed => {
            let str = '是否订阅：'+isSubscribed;
            hyExt.logger.info(str);
            this.showText(str); 
          }).catch((error)=>{
            this.showText("查询失败："+JSON.stringify(error));
        });
    }

    _onPress2() {
        hyExt.context.leadSubscribe().then(() => {
            let str = '引导成功';
            hyExt.logger.info(str);
            this.showText(str); 
          }).catch((error)=>{
            this.showText("引导失败："+JSON.stringify(error));
        });
    }

    _onPress3() {
        hyExt.context.on('subscribeSubmit',this._callback);
        this.setState(previousState => {
          if(previousState.hasObserver) {
              hyExt.logger.info("取消监听订阅");
              hyExt.context.off("subscribeSubmit",this._callback);
          } else {
              hyExt.logger.info("监听订阅变化");
              hyExt.context.on("subscribeSubmit",this._callback);
          }
          return { hasObserver: !previousState.hasObserver};
        });
    }

    _callback(message) {
        hyExt.logger.info("recive subscribeSubmit message:",message);
        //hyExt.context.showToast("收到后台消息："+message);
        this.showText("收到subscribeSubmit消息："+message);
    }
    contentView() {
      let title = this.state.hasObserver ? "取消监听":"监听订阅变化";
        return (
            <View
               style = {{left:15,right:15,height:this.contentViewHeight()}}
            >
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onPress1.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>查询订阅</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onPress2.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>引导订阅</Text>
                    </View>
                 </TouchableOpacity>
                 <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onPress3.bind(this)}
                  >
                    <View style = {{width:100,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>{title}</Text>
                    </View>
                 </TouchableOpacity>
               </View>
            </View>
        );
    }

    contentViewHeight() {
        return 40;
    }
    
}
