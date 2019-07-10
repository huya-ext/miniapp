import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import hyExt from 'hyext-rn-sdk';
import StartPanel from './components/StartPanel.js';
import EndPanel from './components/EndPanel.js';
import bus from './util/bus';
import request from './util/request';


export default class app extends Component {
    constructor(initialProps) {
        super();
        this.state = {
            panelType: 3,
            list:{
                raceId:0,
                templateId: -1,
                templateName: '',
                unionId:'',
                raceTime:0,
                endTime:0,
                roomId:0,
                options: []
            },
            endList:{
                raceId:0,
                templateId: -1,
                templateName: '',
                unionId:'',
                raceTime:0,
                endTime:0,
                roomId:0,
                options: []
            },
            gameLaunch:false,
            raceTime:0,
            localCountdownEnd: false,
            countdownEnd: false,//倒计时是否结束
            choose:{//用户点击行为记录
                list:[] //[{"选项ID":"结果"}]
            },
            user:{
                nick:'',
                logo:''
            },
            showPanel: false,
            raceId: ""
        }
    }

    componentWillMount() {}

    componentDidMount() {
        if(typeof hyExt != 'undefined') {
            hyExt.onLoad && hyExt.onLoad(()=> {
                console.log('【hyExt onload】');
                //获取上一次的比赛结果
                this.getRaceResult();

                //观众端推送配置接口
                hyExt.observer && hyExt.observer.on('speed_race_info-push', res => {
                    console.log('【观众端推送配置接口】');
                    console.log(res);
                    try{
                        const data = JSON.parse(res);
                        const {raceId, templateId, templateName, unionId, raceTime, endTime, roomId, options} = data;
                        this.setState({
                            list: Object.assign({}, {raceId, templateId, templateName, unionId, raceTime, endTime, roomId, options}),
                            panelType:2,
                            gameLaunch:false,
                            countdownEnd: false,
                            localCountdownEnd: false,
                            choose: Object.assign({}, {list:[]}),
                            raceId: raceId
                        })
                    } catch(e){}
                })
                //观众端倒计时推送接口
                hyExt.observer && hyExt.observer.on('speed_race_ready-push', res => {
                    console.log('观众端倒计时推送接口');
                    console.log(res);
                    
                    try{
                        const data = JSON.parse(res);
                        const {raceId, templateId, templateName, unionId, raceTime, endTime, roomId, options} = data;
                        this.setState({
                            list: Object.assign({}, {raceId, templateId, templateName, unionId, raceTime, endTime, roomId, options}),
                            panelType:2,
                            gameLaunch:true,
                            countdownEnd: false,
                            localCountdownEnd: false,
                            choose: Object.assign({}, {list:[]}),
                            raceTime: data.raceTime,
                            raceId: raceId
                        })
                    } catch(e){}
                })
                //结果推送接口
                hyExt.observer && hyExt.observer.on('speed_race_finish-push', res => {
                    console.log('结果推送接口');
                    console.log(res);
                    try{
                        const {raceId} = this.state;
                        const data = JSON.parse(res);

                        if(raceId != data.raceId) {
                            console.log('推送结果和当前进行中的raceid不同', res, raceId);
                            return;
                        }

                        this.setState({
                            panelType:3
                        })
                        this.getRaceResult(raceId)
                    } catch(e){}
                })

                hyExt.context && hyExt.context.getUserInfo().then(userInfo => {
                    console.log('获取用户信息成功', userInfo);
                    const {userNick, userAvatarUrl} = userInfo;
                    this.setState({
                        user:{
                            nick: userNick,
                            logo: userAvatarUrl
                        }
                    })
                }).catch(err => {
                    console.log('获取用户信息失败', err);
                })
            })
        }
        //倒计时结束
        bus.on('countdown', () => {
            console.log('倒计时结束');
            this.setState({
                countdownEnd:true
            });
            //上传结果
            this.reportResult();
        })
        //倒计时结束
        bus.on('local-push-start', () => {
            console.log('本地3秒倒计时结束');
            this.setState({
                localCountdownEnd:true
            });
        })
        bus.on('join', () => {
            console.log('join');
            this.setState({
                panelType:2
            })
        })
        bus.on('choose', (item) => {
            console.log('choose click');
            console.log(item);
            const {countdownEnd, choose, gameLaunch} = this.state, {list} = choose;
            //倒计时结束后不再可点
            if(!gameLaunch || countdownEnd) return;
            let exist = false;

            for(let i=0;i<list.length;i++) {
                let tempValue = list[i][item.optionId];
                if(tempValue) {
                    //ebs要求value必须为字符串
                    list[i][item.optionId] = String(parseInt(tempValue) + 1);
                    exist = true;
                }
            }

            if(!exist) {
                const ob = {};
                ob[item.optionId] = '1';
                list.push(ob)
            }

            this.setState({
                choose:Object.assign({}, choose, {list: list})
            })
        })
    }

    componentWillUnmount() {
        hyExt.observer && hyExt.observer.off('speed_race_info-push');
        hyExt.observer && hyExt.observer.off('speed_race_ready-push');
        hyExt.observer && hyExt.observer.off('speed_race_finish-push');
    }
    reportResult(){
        const {list, choose, user} = this.state, {nick, logo} = user
        request.reportResult(String(list.raceId), JSON.stringify(choose.list), nick, logo).then((result) => {
            console.log('---reportResult-----');
            console.log(result);
        }).catch((e) => {
        })
    }
    getRaceResult (raceId) {
        console.log('【start to get race result】');
        request.getRaceResult(raceId).then((result) => {
            console.log('---getRaceResult-----');
            console.log(result);
            let stateData = {
                showPanel: true 
            };

            if(result && result.status == 0) {
                stateData['endList'] = result.data;
            }

            this.setState(stateData)
        }).catch((e) => {
            console.log('---getRaceResult error-----');
            console.log(e);
            this.setState({
                showPanel: true 
            })
        })
    }
    render() {
        const {panelType, list, endList, raceTime, choose, gameLaunch, showPanel, countdownEnd, localCountdownEnd} = this.state
        return (
            showPanel ?
            <ScrollView style={styles.container}>
                { panelType === 2 && <StartPanel list={list} raceTime={raceTime} choose={choose} gameLaunch={gameLaunch} localCountdownEnd={localCountdownEnd} countdownEnd={countdownEnd}/> }
                { panelType === 3 && <EndPanel list={endList} chooseList={choose.list} countdownEnd={countdownEnd}/> }
            </ScrollView>
            :
            <ScrollView style={styles.container}></ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
      position:'relative',
      backgroundColor:'#F9F9F9',
      width:'100%',
      height:'100%'
    }
});
  