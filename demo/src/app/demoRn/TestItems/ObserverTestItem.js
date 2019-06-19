import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class ObserverTestItem extends TestItemBase {
    constructor(props){
        super(props);
        this._title = "observer接口";
        this._callback = this._callback.bind(this);
    }

    _onListenBtnPress() {
        if(this._event == undefined || !this._event.length) {
            hyExt.context.showToast('事件名不能为空');
            return;
        }
        hyExt.logger.info("listen observer:",this._event);
        hyExt.observer.on(this._event, this._callback);
    }

    _onUnListenBtnPress() {
        if(this._event == undefined || !this._event.length) {
            hyExt.context.showToast('事件名不能为空');
            return;
        }
        hyExt.logger.info("cancel listen observer:",this._event);
        hyExt.observer.off(this._event, this._callback);
    }

    _callback(message) {
        hyExt.logger.info("recive observer message:",message);
        //hyExt.context.showToast("收到后台消息："+message);
        this.showText("收到后台消息："+message);
    }
    contentView() {
        return (
            <View
               style = {{left:15,right:15,height:this.contentViewHeight()}}
            >
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>事件名: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._event = text}}
                     placeholder="请输入事件名"
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onListenBtnPress.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>监听事件</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onUnListenBtnPress.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>取消监听</Text>
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
