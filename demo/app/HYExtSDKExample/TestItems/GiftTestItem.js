import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class GiftTestItem extends TestItemBase {
    constructor(props){
        super(props);
        this._title = "礼物";
        this._callback = this._callback.bind(this);
        this._giftSubmitCallback = this._giftSubmitCallback.bind(this);
        this.state = {
            hasObserver:false,
            hasObserverSubmit:false
        }
    }

    _onPress1() {
        hyExt.logger.info("引导送礼");
        hyExt.context.leadGift().then(() => {
            let str = '引导送礼成功';
            hyExt.logger.info(str);
            this.showText(str); 
        }).catch(err => {
            this.showText("引导送礼失败："+JSON.stringify(err));
        })
    }

    _onPress2() {
        this.setState(previousState => {
            if(previousState.hasObserverSubmit) {
                hyExt.logger.info("取消监听送礼");
                hyExt.context.off("giftSubmit",this._callback);
            } else {
        hyExt.logger.info("监听送礼");
        hyExt.context.on("giftSubmit",this._callback);
            }
            return { hasObserverSubmit: !previousState.hasObserverSubmit};
          });
    }

    _onPress3() {
        let opt = {};
        if(this._userNick && this._userNick.length) {
            opt.sendNick = this._userNick;
        }

        if(this._itemName && this._itemName.length) {
            opt.itemNick = this._itemName;
        }

        if(this._minCount && this._minCount.length) {
            opt.minSendItemCount = parseInt(this._minCount);
        }

        if(this._minCount && this._minCount.length) {
            opt.minSendItemCount = parseInt(this._minCount);
        }

        if(this._minComboHits && this._minComboHits.length) {
            opt.minSendItemComboHits = parseInt(this._minComboHits);
        }
        this.setState(previousState => {
            if(previousState.hasObserver) {
                hyExt.logger.info("取消监听礼物变化:",JSON.stringify(opt));
                hyExt.context.offGiftChange(this._giftSubmitCallback);
            } else {
        hyExt.logger.info("监听礼物变化:",JSON.stringify(opt));
        hyExt.context.onGiftChange(opt, this._giftSubmitCallback);
            }
            return { hasObserver: !previousState.hasObserver};
          });
    }

    _giftSubmitCallback(content) {
        hyExt.logger.info("recive gift message:",JSON.stringify(content));
        this.showText("收到礼物消息："+JSON.stringify(content));
    }

    _callback(content) {
        hyExt.logger.info("recive send gift message:",JSON.stringify(content));
        this.showText("收到送礼消息："+JSON.stringify(content));
    }

    contentView() {
        let title = this.state.hasObserver ? "取消监听":"监听收礼";
        let title2 = this.state.hasObserverSubmit ? "取消监听":"监听送礼";
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
                  <Text>礼物名称: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._itemName = text}}
                     placeholder={'请输入需要监听的礼物名称'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>最小礼物数: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._minCount = text}}
                     placeholder={'请输入需要监听的最小礼物数'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>最小连击数: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._minComboHits = text}}
                     placeholder={'请输入需要监听的最小礼物连击数'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onPress1.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>引导送礼</Text>
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
