import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class StorageTestItem extends TestItemBase {
    constructor(props){
        super(props);
        this._title = "KV存储";
    }

    _onPress1() {
        if(this._key == undefined || !this._key.length) {
            hyExt.context.showToast('key不能为空');
            return;
        }

        hyExt.logger.info("get key:", this._key);
          hyExt.storage.getItem(this._key).then(val => {
            hyExt.logger.info('获取成功 ',this._key,": ", val)
            this.showText('获取成功 '+this._key+": "+val)
          }).catch((error)=>{
            this.showText("获取key失败："+JSON.stringify(error));
          });
    }

    contentView() {
        return (
            <View
               style = {{left:15,right:15,height:this.contentViewHeight()}}
            >
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>key: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._key = text}}
                     placeholder={'请输入key'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onPress1.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>查询</Text>
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
