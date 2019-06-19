import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyliveext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class UserInfoTestItem extends TestItemBase {
    constructor(props){
        super(props);
        this._title = "用户信息";
    }

    _onPress1() {
        hyExt.logger.info("获取用户信息");
        hyExt.context.getUserInfo().then((data) => {
            hyExt.logger.info("收到用户信息：",JSON.stringify(data))
            let str = JSON.stringify(data);
            this.showText("收到用户信息："+str);
          }).catch((error)=>{
            this.showText("获取用户信息失败："+JSON.stringify(error));
          });
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
                        <Text>获取用户信息</Text>
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
