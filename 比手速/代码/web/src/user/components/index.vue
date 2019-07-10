<template>
    <div>
        <resultPanel :result="result" :settingState="settingState" :pickTotalNum="pickTotalNum" v-if="showResultPanel"></resultPanel>

        <div v-if="showStartPanel" class="unstart_pannel">
            <div class="banner_wrapper">
                <div v-if="showCountDownPanel" class="down_time_wrapper">
                    <div v-if="isReadyCountDown">
                        <p class="tip">即将开始</p>
                        <p v-if="readyCountDownNum > 0" class="time">{{readyCountDownNum}}</p>
                    </div>

                    <div v-else>
                        <p v-if="pickCountDownNum > 0" class="time">00:{{pickCountDownNum < 10 ? `0${pickCountDownNum}` : pickCountDownNum}}</p>
                        <p class="tip" v-if="pickCountDownNum > 0">倒计时进行中</p>
                        <p class="tip" v-else>结果统计中，请稍后</p>
                    </div>
                   
                </div>

                <div v-if="showReadyPanel" class="ready_wrapper">
                    马上开始，请稍作等候
                </div>
            </div>

            <ul class="option_wrapper">
                <li v-for="(item, idx) in optionList" :key="item.optionId" @click="pickOption(item.optionId, idx)" class="item">
                    <span class="name">{{item.optionName}}</span>
                    <img class="avatar" :src="trimHttp(item.optionLogo)" />

                    <p class="btn" :class="{disabled: !isUserCanPick, abled: isUserCanPick}">点击</p>

                    <div class="add_effect_wrapper" :class="{show: showAddEffectList[idx].show}">
                        <img src="../assets/img/effect_icon.png" class="icon">
                    </div>
                </li>
            </ul>

            <p class="tip">点击投票，替主播做出选择吧！</p>
        </div>
    </div>
</template>

<script>
    import CONFIG from '../assets/config'
    import util from '../assets/util'
    import eventBus from '../assets/eventBus'

    import resultPanel from './resultPanel'

    const { settingStateMap } = CONFIG;

    export default {
        data() {
            return {
                raceId: null,
                optionList: [],
                choosedOptionList: {},
                result: null,
                settingState: settingStateMap.lastResult,
                pickCountDownNum: 0,
                readyCountDownNum: 0,
                pickTotalNum: 0,
                showAddEffectList: [
                    {
                        show: false,
                        timer: null
                    }, 
                    {
                        show: false,
                        timer: null
                    }, 
                    {
                        show: false,
                        timer: null
                    }],
                isReadyCountDown: true // 正在进行准备时间的倒计时
            }
        },
        created() {
            hyExt.onLoad(() => { 
                this.getLastMatchResult(); //调用ebs接口
                this.registerListener();
            })
            
            this.getUserInfo(); //用户信息授权
        },
        methods: {
            getUserInfo() {
                hyExt.context.getUserInfo()
                    .then(userInfo => {
                        this.userInfo = userInfo;

                        console.log('用户信息', userInfo);
                    })
            },
            getOptionNameById(id) {
                return this.optionList.find(item => item.optionId == id).optionName;
            },
            formatResult(data) {
                this.result = {
                    optionRank: data.result.optionRank.map(item => {
                        return {
                            ...item,
                            ...{
                                optionName: this.getOptionNameById(item.optionId)
                            }
                        }
                    }),
                    perOptionRank: data.result.perOptionRank.map(item => {
                        return {
                            ...item,
                            ...{
                                optionName: this.getOptionNameById(item.optionId)
                            }
                        }
                    })
                }
            },
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
                    if(res.status === 0) {
                        if(res.data && res.data.raceId) { // 之前开启过
                            this.optionList = res.data.options;
                            this.result = res.data.options;
                        }else{ // 未开启显示敬请期待
                        }
                    }else {
                           
                    }

                    if(!raceId) {
                        console.log('上次的结果', res);
                    }else{
                        console.log('比赛结果', res);
                    }
                })
            },
            // 开始准备时间的倒计时
            startReadyTimeCountDown() {
                this.readyCountDownNum = 3;
                this.isReadyCountDown = true;
                var timer = setInterval(() => {
                    if(this.readyCountDownNum <= 0) {
                        this.startPickTimeCountDown(this.raceTime);
                        this.isReadyCountDown = false;
                        clearInterval(timer);
                    }

                    this.readyCountDownNum--;
                }, 1000)
            },
            // 开始点击的倒计时
            startPickTimeCountDown(initCountDownTime) {
                this.pickCountDownNum = initCountDownTime;
                var countDownTimer = setInterval(() => {
                    if(this.pickCountDownNum <= 0) {
                        this.reportPickResult();
                        clearInterval(countDownTimer);
                    }

                    this.pickCountDownNum--;
                }, 1000)
            },
            reportPickResult() {
                var result = Object.keys(this.choosedOptionList).map(key => {
                    return {
                        [key]: "" + this.choosedOptionList[key]
                    }
                })

                util.request({
                    service: 'reportResult',
                    method: 'POST',
                    param: {
                        raceId: this.raceId,
                        result: JSON.stringify(result),
                        nick: this.userInfo ? this.userInfo.userNick : '',
                        logo: this.userInfo ? this.userInfo.userAvatarUrl : ''
                    }
                })
                .then(res => {
                    console.log('上报用户操作结果', res);
                })
            },
            registerListener() {
                // 主播保存了配置
                hyExt.observer.on('speed_race_info-push', res => {
                    res = JSON.parse(res);

                    // 由上一次的结果面板 变成了设置项
                    this.settingState = settingStateMap.ready;
                    this.optionList = res.options;
                    this.raceId = res.raceId;

                    console.log('保存配置推送', 'speed_race_info-push', res, res.raceId);
                })

                // 主播点击了开始
                hyExt.observer.on('speed_race_ready-push', res => {
                    res = JSON.parse(res);

                    this.optionList = res.options;
                    this.raceId = res.raceId;

                    this.choosedOptionList = {};
                    this.pickTotalNum = 0;
                    this.raceTime = res.raceTime;
                    
                    // 显示倒计时中，用户可以点击了
                    this.settingState = settingStateMap.countDown;
                    this.startReadyTimeCountDown();

                    console.log('启动推送', 'speed_race_ready-push', res)
                })

                // 结果推送
                hyExt.observer.on('speed_race_finish-push', res => {
                    res = JSON.parse(res);

                    this.getLastMatchResult(this.raceId);
                    // this.result = res.options;
                    this.settingState = settingStateMap.end;
                    // todo: 设置用户的点击结果


                    console.log('结果推送', 'speed_race_finish-push', res);

                })
            },
            pickOption(optionId, idx) {
                if(!this.isUserCanPick) {
                    return;
                }

                if(this.choosedOptionList[optionId]) {
                    this.choosedOptionList[optionId]++;
                }else {
                    this.choosedOptionList[optionId] = 1;
                }

                this.pickTotalNum++;

                this.showScreenAddEffect(idx);
            },
            showScreenAddEffect(idx) {
                this.showAddEffectList[idx].timer && clearTimeout(this.showAddEffectList[idx].timer);

                this.showAddEffectList[idx].show = true;

                this.showAddEffectList[idx].timer = setTimeout(() => {
                    this.showAddEffectList[idx].show = false;
                }, 200)
            },
            trimHttp(url) {
                if(!url) {
                    return require('../assets/img/default_logo.png');
                }else{
                    return util.trimHttp(url);
                }
            }
        },
        computed: {
            showResultPanel() {
                return this.settingState == settingStateMap.lastResult || 
                        this.settingState == settingStateMap.end;
            },
            showStartPanel() {
                return this.showCountDownPanel || this.showReadyPanel;
            },
            showCountDownPanel() {
                return this.settingState == settingStateMap.countDown;
            },
            showReadyPanel() {
                return this.settingState == settingStateMap.ready;
            },
            // 用户是否可以点击
            isUserCanPick() {
                return (this.settingState == settingStateMap.countDown && this.pickCountDownNum > 0) && !this.isReadyCountDown;
            }
        },
        components: {
            resultPanel
        } 
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    @import '../assets/scss/common';

    .unstart_pannel{
        width: 100%;
        background: #F9F9F9;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .banner_wrapper{
            width: 100%;
            height: size(510px);
            background: url('../assets/img/banner.png') no-repeat;
            background-size: 100% 100%;
            
            .down_time_wrapper{
                text-align: center;
                padding-top: size(120px);

                .time{
                    font-size: size(120px);
                    color: #fff;
                    line-height: size(138px);
                    font-weight: bold;
                    text-align: center;
                }

                .tip{
                    text-align: center;
                    font-size: size(30px);
                    color: #fff;
                    margin-top: size(33px);
                }
            }

            .ready_wrapper{
                text-align: center;
                padding-top: size(150px);
                font-size: size(50px);
                color: #fff;
            }
        }

        .option_wrapper{
            width: size(700px);
            margin: size(-140px) auto 0;
            display: flex;
            justify-content: space-around;

            .item{
               width: size(220px);
               height: size(354px);
               display: flex;
               align-items: center;
               flex-direction: column;

               background: #fff;
               border-top-left-radius: size(16px);
               border-top-right-radius: size(16px);
               cursor: pointer;
               position: relative;

                .name{
                    font-size: size(30px);
                    color: #222222;
                    margin-top: size(32px);
                }

                .avatar{
                    width: size(134px);
                    height: size(134px);
                    margin-top: size(20px);
                    margin-bottom: size(26px); 
                    border-radius: 50%;
                }

                .btn{
                    width: size(175px);
                    height: size(68px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    background: #FFA200;
                    border-radius: size(35px);
                    &.disabled{
                        background: #d3d3d3;
                        cursor: default;
                    }

                    &.abled{
                        &:active{
                            background: #cc8100;
                        }
                    }
                }

                .add_effect_wrapper{
                    position: absolute;
                    top: size(190px);
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0;
                    transition: all 0.2s linear;


                    &.show{
                        top: size(110px);
                        width: size(62px);
                        height: size(42px);
                        opacity: 1;
                    }

                    .icon{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

        .tip{
            text-align: center;
            font-size: size(30px);
            color: #999999;
            margin-top: size(72px);
        }
    }
    

</style>
