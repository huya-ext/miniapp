import React, { Component } from 'react'
import { Text, View, TextInput, Button, TouchableOpacity } from 'react-native'

import hyExt from 'hyext-rn-sdk';

import TestItemBase from './TestItemBase'

export default class SubscribeTestItem extends TestItemBase {
    constructor(props) {
        super(props);
        this._title = "直播间信息";
        // this._callback = this._callback.bind(this);
        // this._callback2 = this._callback2.bind(this);
        // this.state = {
        //     hasLiveStateObservered:false,
        //     hasLiveInfoObservered:false,
        // }
    }

    // _onPress1() {
    //     this.setState(previousState => {
    //         if(previousState.hasLiveInfoObservered) {
    //             hyExt.context.off("liveInfoChanged", this._callback);
    //         } else {
    //             hyExt.context.on("liveInfoChanged", this._callback);
    //         }
    //         return { hasLiveInfoObservered: !previousState.hasLiveInfoObservered};
    //       });
    // }

    // _onPress2() {
    //     this.setState(previousState => {
    //         if(previousState.hasLiveStateObservered) {
    //             hyExt.context.off("liveStateChanged", this._callback2);
    //         } else {
    //             hyExt.context.on("liveStateChanged", this._callback2);
    //         }
    //         return { hasLiveStateObservered: !previousState.hasLiveStateObservered};
    //       });
    // }

    // _callback(message) {
    //     hyExt.logger.info("recive liveInfoChanged message:",JSON.stringify(message));
    //     this.showText("收到直播间信息消息："+JSON.stringify(message));
    // }

    // _callback2(message) {
    //     hyExt.logger.info("recive liveStateChanged message:",JSON.stringify(message));
    //     this.showText("收到直播间状态状态："+JSON.stringify(message));
    // }

    _onLiveInfoPressed() {
        hyExt.logger.info("获取直播间信息");
        hyExt.context.getLiveInfo().then((liveInfo) => {
            let { gameName, liveCount, roomTitle, startTime, isOn } = liveInfo;
            hyExt.logger.info("收到直播间信息：", JSON.stringify(liveInfo))
            this.showText("收到直播间信息：gameName:" + gameName + ";roomTitle:" + roomTitle + ";liveCount:" + liveCount + ";startTime:" + startTime + ";isOn:" + isOn);
        }).catch((error) => {
            hyExt.logger.warn('get live info failed', JSON.stringify(error));
            this.showText("获取直播间信息失败：" + JSON.stringify(error));
        });
    }
    _onFansRankPressed() {
        hyExt.context.getFansRank().then(fansRank => {
            let { badgeName, rank } = fansRank;
            if(badgeName != undefined && rank != undefined) {
                this.showText("badgeName:" + badgeName);
                rank.forEach((item, index) => {
                    let { userNick, userAvatarUrl, score, fansLevel } = item;
                    let str = (index + 1) + ":" + "userNick:" + userNick + ";userAvatarUrl:" + userAvatarUrl + ";score:" + score + ";fansLevel:" + fansLevel;
                    hyExt.logger.info(str);
                    this.showText("收到粉丝榜信息：" + str);
                });
            }
        }).catch((error) => {
            hyExt.logger.warn('get fansRank failed', JSON.stringify(error));
            this.showText("获取粉丝榜信息失败：" + JSON.stringify(error));
        })
    }

    _onVIPPressed() {
        hyExt.context.getVip().then(vipList => {
            vipList.forEach((item, index) => {
              let { userNick, userAvatarUrl, nobleLevel, nobleName } = item;
              let str = (index + 1) + ":" + "userNick:" + userNick + ";userAvatarUrl:" + userAvatarUrl + ";nobleLevel:" + nobleLevel + ";nobleName:" + nobleName;
              hyExt.logger.info(str);
              this.showText("收到贵宾信息：" + str);
            })
          }).catch((error) => {
            hyExt.logger.warn('get vip list failed', JSON.stringify(error));
            this.showText("获取贵宾信息失败：" + JSON.stringify(error));
          })          
    }

    _onWeekRankPressed() {
        hyExt.context.getWeekRank().then(weekRank => {
            weekRank.forEach((item, index) => {
              let { userNick, userAvatarUrl, score } = item
              let str = (index + 1) + ":" + "userNick:" + userNick + ";userAvatarUrl:" + userAvatarUrl + ";score:" + score;
              hyExt.logger.info(str);
              this.showText("收到周贡榜信息：" + str);
            })
          }).catch((error) => {
            hyExt.logger.warn('get weekRank failed', JSON.stringify(error));
            this.showText("获取周贡榜信息失败：" + JSON.stringify(error));
          })          
    }

    contentView() {
        // let btn1Title = this.state.hasLiveInfoObservered ? "取消监听直播间信息":"监听直播间信息";
        // let btn2Title = this.state.hasLiveStateObservered ? "取消监听直播间状态":"监听直播间状态";
        let liveInfoTitle = "获取直播间信息";
        let fansRankTitle = "获取粉丝榜信息";
        let vipTitle = "获取贵宾信息";
        let weekRankTitle = "获取周贡榜信息";
        return (
            <View
                style={{ left: 15, right: 15, height: this.contentViewHeight() }}
            >
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        {/* <TouchableOpacity
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
                 </TouchableOpacity> */}
                        <TouchableOpacity
                            onPress={this._onLiveInfoPressed.bind(this)}
                        >
                            <View style={{ width: 140, height: 31, backgroundColor: '#FFA200', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>{liveInfoTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ width: 15 }} />
                        <TouchableOpacity
                            onPress={this._onFansRankPressed.bind(this)}
                        >
                            <View style={{ width: 140, height: 31, backgroundColor: '#FFA200', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>{fansRankTitle}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 40, flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={this._onVIPPressed.bind(this)}
                        >
                            <View style={{ width: 140, height: 31, backgroundColor: '#FFA200', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>{vipTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ width: 15 }} />
                        <TouchableOpacity
                            onPress={this._onWeekRankPressed.bind(this)}
                        >
                            <View style={{ width: 140, height: 31, backgroundColor: '#FFA200', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>{weekRankTitle}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    contentViewHeight() {
        return 90;
    }

}
