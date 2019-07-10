import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, Picker } from 'react-native';
import hyExt from 'hyliveext-rn-sdk';

import SettingPanel from './components/SettingPanel';
import AddOptionDialog from './components/AddOptionDialog';
import CoutingDownPanel from './components/CoutingDownPanel';

import Toast from './components/toast';

import CONFIG from './assets/config';
import util from './assets/util';
import eventBus from './tools/bus';

import EndPanel from './components/EndPanel';
import Mask from './components/mask'

import pxUtil from './tools/px2dp'
const px2dp = pxUtil.px2dp;
const {settingStateMap} = CONFIG

export default class fasterHandRNStreamer extends Component {
    constructor(initialProps) {
        super();

        this.state = {
            raceId: 0,
            actionTime: CONFIG.defaultActionTime,
            choosedTplId: -1,
            choosedTplName: "",
            choosedOptionList: [],
            tplOptionList: [],
            isShowSettingDialog: false,
            result: null,
            settingState: settingStateMap.unstart,
            pickCountDownNum: 0,
            readyCountDownNum: 0,
            isReadyCountDown: true,
            activeOptionId: '',
            activeOptionIdx: 0,
            isDataReady: false,
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        hyExt && hyExt.onLoad(() => {
            this.getTplOptionList();
            this.registerResultListener();

            console.log('sdk加载完毕');
        })

        this.registerEventListeners();
    }   

    getChoosedTplName(choosedTplId) {
        const { tplOptionList } = this.state;
        const findItem = tplOptionList.find(item => item.templateId == choosedTplId);

        console.log('模板ID', findItem, choosedTplId);
        return findItem ? findItem.templateName : "";
    }

    registerEventListeners() {
        eventBus.on('saveOption', ({choosedOptionId, iptOptionName}) => {
            const {tplOptionList, choosedTplId, choosedOptionList} = this.state;

            if(this.isDefaultTpl()) {
                const findItem = tplOptionList.find(item => item.templateId == choosedTplId);

                const defaultOptions = findItem ? findItem.options : [];

                console.log('填写的选项', findItem, defaultOptions);

                if(defaultOptions.length) {
                    for(var i = 0, len = defaultOptions.length; i < len; i++) {
                        var currentOptionId = defaultOptions[i].optionId;

                        if(!choosedOptionList.find(item => item.optionId == currentOptionId)) {
                            choosedOptionList.push({
                                ...defaultOptions[i],
                                optionName: iptOptionName
                            })

                            console.log('保存的选项', choosedOptionList)
                            this.setState({
                                choosedOptionList
                            })

                            return;
                        }
                    }
                }
            }else{
                const choosedOptionRangeList = this.getChoosedOptionRangeList()

                const choosedItem = choosedOptionRangeList.find(item => item.optionId == choosedOptionId);

                console.log('保存了选择项', choosedOptionRangeList, choosedItem);

                const {choosedOptionList} = this.state;

                choosedOptionList.push(choosedItem);

                this.setState({
                    choosedOptionList
                })
            }
        })

        eventBus.on('deleteOption', idx => {
            
            const { choosedOptionList } = this.state;
            choosedOptionList.splice(idx, 1);

            console.log('deleteOption', idx, choosedOptionList);
            this.setState({
                choosedOptionList
            })
        })

        eventBus.on('showAddOptionDialog', res => {
            this.setState({
                isShowSettingDialog: true
            })
        });

        eventBus.on('hideAddOptionDialog', res => {
            this.setState({
                isShowSettingDialog: false
            })
        })

        eventBus.on('changeTpl', tplId => {
            this.setState({
                choosedTplId: tplId,
                choosedTplName: this.getChoosedTplName(tplId),
                choosedOptionList: []
            })
        })

        eventBus.on('reStart', () => {
            this.setState({
                settingState: settingStateMap.unstart,
                result: null,
                pickCountDownNum: 0,
                raceId: ""
            })
        })

        eventBus.on('saveSettingConfig', ({actionTime, raceId}) => {
            this.setState({
                actionTime,
                raceId
            })
        })

        eventBus.on('startReadyTimeCountDown', () => {
            this.startReadyTimeCountDown();
        })
    }


    getChoosedOptionRangeList() {
        const {tplOptionList, choosedTplId} = this.state;
        var findedItem = tplOptionList.find(item => item.templateId == choosedTplId);

        return findedItem ? findedItem.options : [];
    }

    getTplOptionList() {
        util.request({
            service: 'getAllTemplates'
        })
        .then(res => {
            if(res.status === 0 && res.data) {
                const choosedTplId = res.data ? res.data[0].templateId : -1;

                this.setState({
                    tplOptionList: res.data,
                    choosedTplId,
                    isDataReady: true
                }, () => {
                    this.setState({
                        choosedTplName: this.getChoosedTplName(choosedTplId)
                    })
                })
            }else{
                util.showToast(res.msg);
            }

            console.log('模板详情', res);
        })
    }


    registerResultListener() {

        var handler = hyExt.observer.on('speed_race_finish-push', res => {
            try{
                const { raceId } = this.state;
                res = typeof res == 'string' ? JSON.parse(res) : res;

                this.getLastMatchResult(raceId);

                this.setState({
                    settingState: settingStateMap.end
                })
            }catch(err) {
                console.log('监听上次比赛结果报错', res, err);
            }

            console.log('监听倒计时结束', res);
        })
    }

    getLastMatchResult(raceId = "") {
        if(raceId) {
            var questParam = {
                service: 'getRaceResult',
                param: {
                    raceId: raceId
                }
            }
        }else{
            var questParam = {
                service: 'getRaceResult',   
            }
        }

        util.request(questParam)
        .then(res => {
            if(!raceId) {
                console.log('上次的结果', res);
            }else{
                console.log('比赛结果', res);
            }

            if(res.status === 0) {
                if(res.data && res.data.raceId) { // 之前开启过
                    this.setState({
                        result: res.data.options
                    })
                }else{ // 未开启显示敬请期待
                    util.showToast(res.msg);
                }
            }else {
                util.showToast(res.msg);
            }

           
        })
    }

    startAction() {
        const {choosedOptionList, raceId} = this.state;

        if(!choosedOptionList.length) {
            util.showToast('请填写完所有选项');
            return;
        }

        if(raceId <= 0) {
            util.showToast('请先保存好设置，再启动');
            return;
        }

        util.request({
            service: 'startRace',
            method: 'POST',
            param: {
                raceId: raceId
            }
        })
        .then(res => {
            if(res.status === 0) {
                console.log('启动成功');
                this.startReadyTimeCountDown();
            }else{
                util.showToast(res.msg);
            }

            console.log('开始启动', res)
        })
    }

    startReadyTimeCountDown() {
        console.log('开始倒计时');
        this.setState({
            readyCountDownNum: 3,
            isReadyCountDown: true,
            settingState: settingStateMap.countDown
        }, () => {
            var timer = setInterval(() => {
                var {readyCountDownNum} = this.state;
                if(readyCountDownNum <= 0) {
                    this.startPickTimeCountDown();
                    this.isReadyCountDown = false;
    
                    this.setState({
                        isReadyCountDown: false
                    }, () => {
                        clearInterval(timer);
                    })
                }
                
                
                this.setState({
                    readyCountDownNum: --readyCountDownNum
                })
            }, 1000)
        })
    }

    startPickTimeCountDown() {
        const { actionTime } = this.state;
        this.setState({
            pickCountDownNum: actionTime
        }, () => {
            var countDownTimer = setInterval(() => {
                var { pickCountDownNum } = this.state;
                if(pickCountDownNum <= 0) {
                    clearInterval(countDownTimer);
                }


                this.setState({
                    pickCountDownNum: --pickCountDownNum
                })
            }, 1000)
        })
    }

    isDefaultTpl() {
        const { choosedTplId } = this.state;
        return choosedTplId == -1;
    }

    render() {
        const { 
            settingState, 
            isShowSettingDialog, 
            choosedTplId, 
            choosedTplName,
            choosedOptionList, 
            pickCountDownNum, 
            readyCountDownNum,
            result,
            raceId,
            tplOptionList,
            isDataReady,
            isReadyCountDown
        } = this.state;

        console.log('app 渲染', tplOptionList, choosedTplId);


        return (
                <ScrollView  style={styles.wrapperStyle} >

                    {
                        settingState == settingStateMap.unstart && isDataReady &&
                        <SettingPanel tplOptionList={tplOptionList} choosedTplId={choosedTplId} choosedTplName={choosedTplName} raceId={raceId} choosedOptionList={choosedOptionList}></SettingPanel>
                    }

                    {
                        isShowSettingDialog && isDataReady &&
                        <AddOptionDialog choosedTplId={choosedTplId} tplOptionList={tplOptionList} choosedOptionList={choosedOptionList}  ></AddOptionDialog>
                    }

                    {
                        settingState == settingStateMap.countDown && 
                        <CoutingDownPanel pickCountDownNum={pickCountDownNum} readyCountDownNum={readyCountDownNum} isReadyCountDown={isReadyCountDown}></CoutingDownPanel>
                    }


                    {
                        settingState == settingStateMap.end && result && result.length &&
                        <EndPanel list={result}></EndPanel>
                    }

                    {
                        isShowSettingDialog && 
                        <Mask></Mask>
                    }

                    <Toast></Toast>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    wrapperStyle: {
        flex: 1,
        height: px2dp(2000)
    }
})