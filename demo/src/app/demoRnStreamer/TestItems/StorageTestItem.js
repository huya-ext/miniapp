import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyliveext-rn-sdk';

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
            hyExt.logger.info("获取key失败："+ JSON.stringify(error))
            this.showText("获取key失败："+JSON.stringify(error));
          });
    }

    _onPress2() {
      if(this._key == undefined || !this._key.length) {
          hyExt.context.showToast('key不能为空');
          return;
      }
      if(this._value == undefined || !this._value.length) {
        hyExt.context.showToast('value不能为空');
        return;
    }

      hyExt.logger.info("set item:", this._key, ": ", this._value);
        hyExt.storage.setItem(this._key, this._value).then(val => {
          hyExt.logger.info('设置成功 ')
          this.showText('设置成功')
        }).catch((error)=>{
          hyExt.logger.info('设置失败 ')
          this.showText("设置key失败："+JSON.stringify(error));
        });
  }

  _onPress3() {
    if(this._key == undefined || !this._key.length) {
        hyExt.context.showToast('key不能为空');
        return;
    }

    hyExt.logger.info("remove key:", this._key);
      hyExt.storage.removeItem(this._key).then(val => {
        hyExt.logger.info('删除成功 ',this._key,": ", val)
        this.showText('删除成功 '+this._key+": "+val)
      }).catch((error)=>{
        hyExt.logger.info("删除key失败："+JSON.stringify(error))
        this.showText("删除key失败："+JSON.stringify(error));
      });
}

_onPress4() {
  hyExt.logger.info("get all key:");
    hyExt.storage.getKeys().then(val => {
      hyExt.logger.info('获取成功 ', JSON.stringify(val))
      this.showText('获取成功 '+": "+ JSON.stringify(val))
    }).catch((error)=>{
      hyExt.logger.info('获取key失败 ',+JSON.stringify(error))
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
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>value: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._value = text}}
                     placeholder={'请输入value(仅在设置有效)'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onPress1.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>查询key</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onPress2.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                          <Text>设置key</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onPress3.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                          <Text>删除key</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onPress4.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                          <Text>查询所有key</Text>
                    </View>
                  </TouchableOpacity>
               </View>
            </View>
        );
    }

    contentViewHeight() {
        return 120;
    }
    
}
