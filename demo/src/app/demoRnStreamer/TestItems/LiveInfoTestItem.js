import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyliveext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class SubscribeTestItem extends TestItemBase {
    constructor(props){
        super(props);
        this._title = "直播间信息";
        this._callback = this._callback.bind(this);
        this._callback2 = this._callback2.bind(this);
        this.state = {
            hasLiveStateObservered:false,
            hasLiveInfoObservered:false,
        }
    }

    _onPress1() {
        this.setState(previousState => {
            if(previousState.hasLiveInfoObservered) {
                hyExt.context.off("liveInfoChanged", this._callback);
            } else {
                hyExt.context.on("liveInfoChanged", this._callback);
            }
            return { hasLiveInfoObservered: !previousState.hasLiveInfoObservered};
          });
    }

    _onPress2() {
        this.setState(previousState => {
            if(previousState.hasLiveStateObservered) {
                hyExt.context.off("liveStateChanged", this._callback2);
            } else {
                hyExt.context.on("liveStateChanged", this._callback2);
            }
            return { hasLiveStateObservered: !previousState.hasLiveStateObservered};
          });
    }

    _callback(message) {
        hyExt.logger.info("recive liveInfoChanged message:",JSON.stringify(message));
        //hyExt.context.showToast("收到后台消息："+message);
        this.showText("收到直播间信息消息："+JSON.stringify(message));
    }

    _callback2(message) {
        hyExt.logger.info("recive liveStateChanged message:",JSON.stringify(message));
        //hyExt.context.showToast("收到后台消息："+message);
        this.showText("收到直播间状态状态："+JSON.stringify(message));
    }
    contentView() {
        let btn1Title = this.state.hasLiveInfoObservered ? "取消监听直播间信息":"监听直播间信息";
        let btn2Title = this.state.hasLiveStateObservered ? "取消监听直播间状态":"监听直播间状态";
        return (
            <View
               style = {{left:15,right:15,height:this.contentViewHeight()}}
            >
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onPress1.bind(this)}
                  >
                    <View style = {{width:140,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>{btn1Title}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onPress2.bind(this)}
                  >
                    <View style = {{width:140,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>{btn2Title}</Text>
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
