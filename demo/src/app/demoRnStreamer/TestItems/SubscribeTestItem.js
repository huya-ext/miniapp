import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyliveext-rn-sdk';

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
       hyExt.logger.info("getSubscriberSummary");
          hyExt.context.getSubscriberSummary().then(val => {
            hyExt.logger.info('获取成功' + JSON.stringify(val))
            this.showText('获取成功' + JSON.stringify(val))
          }).catch((error)=>{
            hyExt.logger.info("获取失败："+ JSON.stringify(error))
            this.showText("获取失败："+JSON.stringify(error));
          });
  }

    _callback(message) {
        hyExt.logger.info("recive subscribeSubmit message:",message);
        //hyExt.context.showToast("收到后台消息："+message);
        this.showText("收到subscribeSubmit消息："+message);
    }
    contentView() {
        return (
            <View
               style = {{left:15,right:15,height:this.contentViewHeight()}}
            >
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onPress1.bind(this)}
                  >
                    <View style = {{width:100,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>获取用户订阅信息</Text>
                    </View>
                 </TouchableOpacity>
               </View>
            </View>
        );
    }

    contentViewHeight() {
        return 80;
    }
    
}
