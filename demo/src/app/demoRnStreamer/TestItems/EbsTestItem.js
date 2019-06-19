import React, { Component } from 'react'
import { Text, View,TextInput,Button,TouchableOpacity } from 'react-native'

import hyExt from 'hyliveext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class EbsTestItem extends TestItemBase {
    constructor(props){
        super(props);
        this._title = "EBS接口";
        this._port = 80;
        this._method = 'GET';
        this._path = '/index.php?r=user/liveinfo&uid=50013282';
        this.host = 'v.huya.com';
    }

    _onRequestEbsPress() {
        if(this._host == undefined || !this._host.length) {
            hyExt.context.showToast('host不能为空');
            return;
        }
        let req = {}
        if(this._header) {
           try {
            req.header = JSON.parse(this._header);
           } catch (error) {
              hyExt.logger.error(JSON.stringify(error));
           }
        }
        if(this._param) {
         try {
            req.param = JSON.parse(this._param);
           } catch (error) {
              hyExt.logger.error(JSON.stringify(error));
           }
        }
        if(this._cookie) {
         try {
            req.cookies = JSON.parse(this._cookie);
           } catch (error) {
              hyExt.logger.error(JSON.stringify(error));
           }
        }
        req.host = this._host;
        req.port = this._port;
        req.path = this._path;
        req.httpMethod = this._method;
        hyExt.logger.info("req esb:",JSON.stringify(req));
        hyExt.requestEbs(
            req
        ).then((data)=>{
              hyExt.logger.info("收到EBS：", data.res,data.msg,JSON.stringify(data.ebsResponse))
              let str = data.res+data.msg+JSON.stringify(data.ebsResponse);
              this.showText("收到EBS："+str);
          }).catch((error)=>{
              this.showText("请求EBS失败："+JSON.stringify(error));
          });
    }

    contentView() {
        return (
            <View
               style = {{left:15,right:15,height:this.contentViewHeight()}}
            >
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>header: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._header = text}}
                     placeholder={'请输入请求header，json key-value格式'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>host: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._host = text}}
                     // placeholder={'请输入请求host'}
                     value = {this._host}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>port: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._port = text}}
                     placeholder={'80'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>path: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._path = text}}
                     placeholder={'请输入请求path'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>httpMethod: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._method = text}}
                     placeholder={'GET'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>param: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._param = text}}
                     placeholder={'请输入请求param，json key-value格式'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row',alignItems:'center'}}>
                  <Text>cookies: </Text>
                  <TextInput 
                     style = {{borderColor:'#979797',borderWidth:0.3,height:31,width:200}}
                     onChangeText={(text)=>{this._cookie = text}}
                     placeholder={'请输入请求cookie，json key-value格式'}
                     autoCapitalize={'none'}
                     autoCorrect={false}
                  />
               </View>
               <View style = {{height:40, flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={this._onRequestEbsPress.bind(this)}
                  >
                    <View style = {{width:80,height:31,backgroundColor:'#FFA200',borderRadius:4,justifyContent:'center',alignItems:'center'}}>
                        <Text>请求EBS</Text>
                    </View>
                  </TouchableOpacity>
               </View>
            </View>
        );
    }

    contentViewHeight() {
        return 320;
    }
    
}
