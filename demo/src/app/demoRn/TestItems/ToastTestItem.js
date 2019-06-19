import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class BarrageTestItem extends TestItemBase {
    constructor(props){
        super(props);
        this._title = "红点";
        this._toast = "toast";
    }

    _onPress1() {
        hyExt.logger.info("显示红点");
        hyExt.context.showActivityBadge().then(() => {
            let str = '显示红点成功';
            hyExt.logger.info(str);
            this.showText(str); 
        }).catch(err => {
            this.showText("显示红点失败："+JSON.stringify(err));
        })
    }

    _onPress2() {
        hyExt.logger.info("显示toast");
        hyExt.context.showToast(this._toast).then(() => {
            let str = 'toast成功';
            hyExt.logger.info(str);
            this.showText(str); 
        }).catch(err => {
            this.showText("toast失败："+JSON.stringify(err));
        })
    }

    contentView() {
        return (
            <View
               style = {{left:15,right:15,height:this.contentViewHeight()}}
            >
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>toast: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._toast = text}}
                     placeholder={'请输入toast'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onPress1.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>显示红点</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{width:15}}/>
                  <TouchableOpacity
                    onPress={this._onPress2.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>显示toast</Text>
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
