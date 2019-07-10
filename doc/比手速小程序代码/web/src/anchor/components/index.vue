<template>
    <div class="main_wrapper">
        <div class="top_bg" :class="{result : showResultPanel || showCoutingDownPanel}">
            <img src="../assets/img/setting_bg.png" class="banner" v-if="showUnStartPanel">
        </div>
        
        <div v-if="showUnStartPanel" class="setting_panel">
            <div class="main">
                <div class="scene_wrapper">
                    <span class="desc">选择场景</span>
                    <select v-model="choosedTplId" class="option_wrapper">
                        <option v-for="option in tplOptionList" v-bind:value="option.templateId" :key="option.templateId" class="item">
                            {{option.templateName}}
                        </option>
                    </select>
                </div>

                <div class="add_option_wrapper" :class="{low_height: choosedOptionList.length <= 1}">
                    <span class="desc">选项设置</span>
                    <ul class="option_list_wrapper" :class="{low_height: choosedOptionList.length <= 1}">
                        <li v-for="(item, idx) in choosedOptionList" :key="item.optionId" class="option_item">
                            <img class="logo" :src="trimHttp(item.optionLogo)" v-if="item.optionLogo" />
                            <span class="name">{{item.optionName}}</span>
                            <img  class="delete_btn" src="../assets/img/delete_icon.png" @click="deleteOption(idx)" />
                        </li>

                        <li class="add_item_wrapper" v-if="showAddOptionIconBtn" @click="showAddOptionDialog">+添加</li>
                    </ul>
                </div>

                <div class="time_wrapper">
                    <span class="desc">持续时长</span>
                    <div class="reduce_icon_wrapper" @click="reduceActionTime">
                        <img src="../assets/img/reduce_icon.png" class="icon" />
                    </div>

                    <p class="time">
                        {{actionTime}}
                    </p>

                    <div class="add_icon_wrapper" @click="addActionTime">
                        <img src="../assets/img/add_icon.png" class="icon"/>
                    </div>
                    <span>秒</span>
                </div>
            </div>

            <div class="btn_wrapper">
                <button type="button" class="save" @click="saveSettingConfig">保存</button>
                <button type="button" class="start" :class="{disabled: !raceId}" @click="startAction">启动</button>
            </div>
        </div>
        
        <div v-if="showCoutingDownPanel" class="count_down_panel">
            <ul class="wait_list_wrapper clearfix">
                <li v-for="item in waitResult" :key="item.optionId" class="item" :class="{f_rank: item.rank == 1}">
                    <p class="rank">{{item.rank}}</p>
                    <img :src="trimHttp(item.optionLogo)" class="bg">
                    <p class="name">{{item.optionName}}</p>
                </li> 
            </ul>

            <div v-if="isReadyCountDown">
                <p class="tip ready">即将开始</p>
                <p v-if="readyCountDownNum > 0" class="time">{{readyCountDownNum}}</p>
            </div>

            <div v-else>
                <p v-if="pickCountDownNum > 0" class="time count_down">00:{{pickCountDownNum < 10 ? `0${pickCountDownNum}` : pickCountDownNum}}</p>
                <p class="tip" v-if="pickCountDownNum > 0">倒计时进行中</p>
                <p class="tip ready" v-else>结果统计中，请稍后</p>
            </div>
        </div>
        
        <div v-if="showResultPanel && result" class="result_panel">
            <div class="result_wrapper current">
                <ul class="rank_list_wrapper" :class="{second: result.length == 2}">
                    <li v-for="item in formatedResult" :key="item.optionId" class="item" :class="{f_rank: item.rank == 1}">
                        <div class="rank_wrapper">
                            <p class="rank">{{item.rank}}</p>
                            <img :src="require(`../assets/img/hg_icon${item.rank}.png`)"  class="hg_icon">
                        </div>
                        <img :src="trimHttp(item.optionLogo)" class="logo">
                        <div class="content_wrapper">
                            <p class="name">{{item.optionName}}</p>
                            <p class="count" :class="{[`rank${item.rank}`]: true}">{{item.voteCnt}}次</p>
                            <img :src="require(`../assets/img/rank_item_bg${item.rank}.png`)" class="item_bg">
                        </div>
                    </li> 
                </ul>
            </div>

            <div class="user_rank_wrapper">
                <p class="title">Top5手速榜</p>

                <ul class="tab_header_wrapper" :class="{one: result.length == 1, two: result.length == 2}">
                    <li v-for="(item, idx) in result" :key="item.optionId" class="item" :class="{active: idx == activeOptionIdx}" @click="switchPanel(idx)">
                        {{item.optionName}}
                    </li>
                </ul>
                
                <ul class="user_rank_content" v-if="activeUserRankList.length > 0">
                    <li v-for="(item, idx) in activeUserRankList" :key="item.uid" class="item" >
                        <div class="left">  
                            <div class="rank_wrapper">
                                <img :src="require(`../assets/img/rank_icon${idx+1}.png`)" class="icon" v-if="idx <= 2">
                                <span v-else class="text">{{idx+1}}</span>
                            </div> 
                            <img :src="trimHttp(item.logo)" class="avatar">
                            <span class="nick ellipsis">{{item.nick}}</span>
                        </div>

                        <div class="right">
                            <span class="count">{{item.voteCnt}}</span>次
                        </div>
                    </li> 
                </ul>

                <div class="empty_wrapper" v-else>
                    <img src="../assets/img/empty_icon.png" class="icon"> 
                    <p class="text">暂无人上榜</p>
                </div>
            </div>

            <div class="restart_btn" @click="restart"> 重新开始 </div>
        </div>

        <optionSettingDialog 
            :choosedTplId="choosedTplId" 
            :optionList="choosedOptionRangeList"
            :choosedOptionList="choosedOptionList"
        >
        </optionSettingDialog>
    </div>
</template>

<script>  
    import optionSettingDialog from './optionSettingDialog'

    import CONFIG from '../assets/config'
    import util from '../assets/util'
    import eventBus from '../assets/eventBus'

    const { settingStateMap } = CONFIG;

    export default {
        data() {
            return {
                raceId: 0,
                actionTime: CONFIG.defaultActionTime,
                choosedTplId: -1,
                choosedOptionList: [],
                tplOptionList: [],
                isShowSettingDialog: false,
                result: null,
                settingState: settingStateMap.unstart,
                pickCountDownNum: 0,
                readyCountDownNum: 0,
                isReadyCountDown: true,
                waitResult: [2, 1, 3],
                activeOptionId: '',
                activeOptionIdx: 0
            }           
        },
        created() {
            hyExt.onLoad(() => {
                this.getTplOptionList();
                this.registerResultListener();
            })
            
            eventBus.$on('saveOption', ({choosedOptionId, iptOptionName}) => {
                console.log('填写的内容是', choosedOptionId, iptOptionName)
                if(this.isDefaultTpl) {
                    const findItem = this.tplOptionList.find(item => item.templateId == this.choosedTplId);

                    const defaultOptions = findItem ? findItem.options : [];

                    console.log('填写的选项', findItem, defaultOptions);

                    if(defaultOptions.length) {
                        for(var i = 0, len = defaultOptions.length; i < len; i++) {
                            var currentOptionId = defaultOptions[i].optionId;

                            if(!this.choosedOptionList.find(item => item.optionId == currentOptionId)) {
                                this.choosedOptionList.push({
                                    ...defaultOptions[i],
                                    optionName: iptOptionName
                                });

                                return;
                            }
                        }
                    }
                }else{
                    const choosedItem = this.choosedOptionRangeList.find(item => item.optionId == choosedOptionId);
                    this.choosedOptionList.push(choosedItem);
                }
            })

            this.waitResult = this.waitResult.map((item, index) => {
                return {
                    optionLogo: require(`../assets/img/wait_result_icon${item}.png`),
                    optionName: '虚位以待',
                    rank: item
                }
            })
        },
        methods: {
            reduceActionTime() {
                if(this.actionTime <= CONFIG.minSettingActionTime) {
                    return;
                }

                this.actionTime--;
            },
            addActionTime() {
                if(this.actionTime >= CONFIG.maxSettingActionTime) {
                    return;
                }
                
                this.actionTime++;
            },
            addOption() {
                this.isShowSettingDialog = true;
            },
            switchPanel(idx) {
                this.activeOptionIdx = idx;
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
            saveSettingConfig() {
                const canSubmit = this.choosedOptionList.length > 0;
                
                if(!canSubmit) {
                    util.showToast('请填写完整后保存配置');
                    return;
                }

                if(this.isDefaultTpl) {
                    var paramList = this.choosedOptionList.map(item => {
                        return {
                            ...item,
                            optionName: util.xssFilter(item.optionName),
                            optionId: "" + item.optionId
                        }
                    })
                }else{
                    var paramList = this.choosedOptionList.map(item => {
                        return {
                            ...item,
                            optionId: "" + item.optionId
                        }
                    })
                }
               
                util.request({
                    service: 'saveRaceConfig',
                    method: 'POST',
                    param: {
                        raceTime: this.actionTime,
                        templateId: this.choosedTplId,
                        options: JSON.stringify(paramList)
                    }
                })
                .then(res => {
                    if(res.status === 0 && res.data) {
                        this.raceId = res.data.raceId;
                        util.showToast('已成功保存');
                    }else{  
                        util.showToast(res.msg);
                    }

                    console.log('保存结果', res);
                })
            },
            startAction() {
                if(!this.choosedOptionList.length) {
                    util.showToast('请填写完所有选项');
                    return;
                }

                if(this.raceId <= 0) {
                    util.showToast('请先保存好设置，再启动');
                    return;
                }

                util.request({
                    service: 'startRace',
                    method: 'POST',
                    param: {
                        raceId: this.raceId
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
            },
            startReadyTimeCountDown() {
                this.readyCountDownNum = 3;
                this.isReadyCountDown = true;
                this.settingState = settingStateMap.countDown;

                var timer = setInterval(() => {
                    if(this.readyCountDownNum <= 0) {
                        this.startPickTimeCountDown(this.raceTime);
                        this.isReadyCountDown = false;
                        clearInterval(timer);
                    }

                    this.readyCountDownNum--;
                }, 1000)
            },
            getTplOptionList() {
                util.request({
                    service: 'getAllTemplates'
                })
                .then(res => {
                    if(res.status === 0) {
                        this.tplOptionList = res.data;

                        if(this.tplOptionList.length) {
                            this.choosedTplId = this.tplOptionList[0].templateId;
                        }
                    }else{
                        util.showToast(res.msg);
                    }

                    console.log('模板详情', res);
                })
            },
            registerResultListener() {
                var handler = hyExt.observer.on('speed_race_finish-push', res => {
                    res = JSON.parse(res);

                    this.getLastMatchResult(this.raceId);
                    this.settingState = settingStateMap.end;


                    console.log('监听倒计时结束', res);
                })
            },
            canelReigster(fn) {
                hyExt.observer.off('speed_race_finish-push', fn);
            },
            startPickTimeCountDown() {
                this.pickCountDownNum = this.actionTime;
                var countDownTimer = setInterval(() => {
                    if(this.pickCountDownNum <= 0) {
                        clearInterval(countDownTimer);
                    }

                    this.pickCountDownNum--;
                }, 1000)
            },
            restart() {
                this.settingState = settingStateMap.unstart;
                this.result = null;
                this.pickCountDownNum = 0;
                this.raceId = "";
            },
            deleteOption(idx) {
                this.choosedOptionList.splice(idx, 1);
            },
            showAddOptionDialog() {
                eventBus.$emit('showDialog');
            },
            trimHttp(url) {
                if(!url) {
                    return require('../assets/img/default_logo.png');
                }else{
                    return util.trimHttp(url);
                }
            }
        },
        components: {
            optionSettingDialog
        },
        computed: {
            choosedOptionRangeList() {
                var findedItem = this.tplOptionList.find(item => item.templateId == this.choosedTplId);
                return findedItem ? findedItem.options : [];
            },
            showCoutingDownPanel() {
                return this.settingState == settingStateMap.countDown;
            },
            showResultPanel() {
                return this.settingState == settingStateMap.end;
            },
            showUnStartPanel() {
                return this.settingState == settingStateMap.unstart;
            },
            showAddOptionIconBtn() {
                return this.choosedOptionList.length < 3;
            },
            choosedTplName() {
                var findedItem = this.tplOptionList.find(item => item.templateId == this.choosedTplId);
                return findedItem ? findedItem.templateName : "未选择";
            },
            formatedResult() {
                var formatResult = [];
                if(this.result.length == 3) {
                    formatResult = [
                        {
                            rank: 2,
                            ...this.result[1]
                        },
                        {
                            rank: 1,
                            ...this.result[0]
                        },
                        {
                            rank: 3,
                            ...this.result[2]
                        }
                    ]
                }else{
                    formatResult = this.result.map((item, idx) => {
                        return {
                            rank: idx + 1,
                            ...item
                        }
                    })
                }

                return formatResult;
            },
            activeUserRankList() {
               if(this.result) {
                    return this.result[this.activeOptionIdx].userRank;
                }
            },
            isDefaultTpl() {
                return this.choosedTplId == -1; //当模板id为-1时 是默认的场景
            }
        },
        watch: {
            choosedTplId: {
                handler: function(val, oldVal) {
                    console.log('切换了场景', val, oldVal);
                    if(val != oldVal) {
                        this.choosedOptionList = [];
                    }
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../assets/scss/partial/_reset';
    @import '../assets/scss/common';

    .ellipsis{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .main_wrapper{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #F9F9F9;
    }

    .top_bg{
        width: 100%;
        height: size(424px);
        position: absolute;
        top: 0;
        
        .banner{
            width: 100%;
            height: 100%;
            z-index: 0;
            user-select: none;
        }

        &.result{
            background: linear-gradient(-180deg, #E1EAFF 0%, #FFFFFF 73%);
            padding-bottom: size(44px);
        }
    }

    .setting_panel{
        position: absolute;
        width: size(670px);
        //width: size(800px); //暂时调整样式

        margin-left: 50%;

        margin-top: size(130px);
        transform: translateX(-50%);
        
        .main{
            background: #fff;
            box-shadow: 0 0 size(10px) size(21px) rgba(227,203,146,0.05);
            border-radius: size(20px);
            padding-top: 1px;
            padding-bottom: size(60px);
        }

        .desc{
            font-size: size(30px);
            color: #666666;
            margin-right: size(35px);
            width: size(120px);
        }

        .scene_wrapper{
            width: size(590px);
            //width: size(740px); //暂时调整样式
            margin: size(60px) auto size(60px);

            display: flex;
            align-items: center;

            .option_wrapper{
                width: size(435px);
                height: size(86px);
                border: size(2px) solid #E7E7E7;
                border-radius: size(8px);
                text-indent: size(20px);

                .item{
                   width: size(435px);
                   height: size(86px);
                } 
            }
        }

        .add_option_wrapper{
            width: size(590px);
            //width: size(740px); //暂时调整样式
            margin: 0 auto;
            // display: flex;
            padding-bottom: size(60px);
            height: size(200px);

            .desc{
                margin-top: size(20px);
                float: left;
                margin-right: size(20px);
            }

            &.low_height{
                //border: size(2px) solid transparent;
                height: size(90px);
            }


            .option_list_wrapper{
                width: size(466px);
                // justify-content: space-between;
                // flex-wrap: wrap;
                float: left;
                margin-bottom: size(-40px);
                margin-left: size(-23px);

                &.low_height{
                    height: size(130px);
                    border: size(2px) solid transparent;
                }

                &::after {
                    clear: both;
                }

                .option_item{
                    width: size(206px);
                    height: size(86px);
                    float: left;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    position: relative;
                    border: size(2px) solid #E7E7E7;
                    border-radius: size(8px);
                    margin-bottom: size(40px);
                    margin-left: size(23px);

                    .logo{
                        width: size(50px);
                        height: size(50px);
                        margin-right: size(15px);
                        border-radius: 50%;
                    }

                    .name{
                        font-size: size(26px);
                    }

                    .delete_btn{
                        width: size(34px);
                        height: size(34px);
                        position: absolute;
                        right: size(-14px);
                        top: size(-14px);
                        cursor: pointer;
                    }
                }

                .add_item_wrapper{
                    width: size(206px);
                    height: size(86px);
                    float: left;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: size(2px) dashed #E7E7E7;
                    border-radius: size(8px);
                    margin-bottom: size(40px);
                    margin-left: size(23px);
                    cursor: pointer;
                }
            }
            
        }

        .time_wrapper{
            //width: size(740px); //暂时调整样式
            width: size(590px);
            margin: 0 auto;

            display: flex;
            align-items: center;

            .reduce_icon_wrapper, .add_icon_wrapper{
                width: size(86px);
                height: size(86px);
                display: flex;
                align-items: center;
                justify-content: center;
                background: #F9F9F9;
                cursor: pointer;
            }

            .reduce_icon_wrapper{
                .icon{
                    width: size(30px);
                    height: size(5px)
                }
            }

            .add_icon_wrapper{
                .icon{
                    width: size(26px);
                    height: size(28px);
                }
            }

            .time{
                border: size(2px) solid #E7E7E7;
                border-radius: size(8px);
                margin-left: size(28px);
                margin-right: size(28px);
                width: size(86px);
                height: size(86px);
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .btn_wrapper{
            //width: size(680px); //暂时调整样式
            margin: size(70px) auto 0;
            display: flex;
            justify-content: space-between;

            .save, .start{
                width: size(315px);
                height: size(90px);
                border-radius: size(200px);
                border: 0;
                font-size: size(32px);
                cursor: pointer;
                display: block;
            }

            .save{
                background: #fff;
                color: #FFA200;
                &:active{
                    background: #e5e5e5;
                }
            }

            .start{
                background: #FFA200;
                color: #fff;
                &:active{
                    background: #e59100;
                }

                &.disabled{
                    background: #e5e5e5;
                    color: #999999;
                    cursor: default;
                }
            }
        }
    }

    .count_down_panel{
        width: 100%;
        position: absolute;
        //margin-top: size(647px);

        .wait_list_wrapper {
            list-style: none;
            position: relative;
            width: size(670px);
            margin: 0 auto;
            z-index: 0;
            padding-top: size(36px);
            padding-bottom: size(44px);

            .item{
                position: relative;
                width: size(210px);
                height: size(336px);
                vertical-align: bottom;
                display: inline-block;

                .name, .rank, .count{
                    color: #fff;
                    text-align: center;
                }

                .rank{
                    margin-top: size(15px);
                    font-size: size(26px);
                }

                .name{
                    font-weight: bold;
                }
            }
        }

        .wait_list_wrapper{
            .item{
                &.f_rank{
                    height: size(377px);
                    margin-left: size(19px);
                    margin-right: size(19px);
                }

                .bg{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: -1;
                }

                .name{
                    margin-top: size(178px);
                }
            }
        }

        .time{
            font-size: size(120px);
            color: #101010;
            line-height: size(138px);
            font-weight: bold;
            text-align: center;
            &.count_down{
                margin-top: size(300px);
            }
        }

        .tip{
            text-align: center;
            font-size: size(30px);
            color: #999999;
            margin-top: size(33px);
            &.ready{
                font-size: size(40px);
                margin-top: size(300px);
                margin-bottom: size(10px);
            }
        }
    }

    .result_panel{
        .rank_list_wrapper {
            list-style: none;
            position: relative;
            width: size(670px);
            margin: 0 auto;
            z-index: 0;
            padding-top: size(36px);
            padding-bottom: size(44px);

            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            .item{
                position: relative;

                .name, .rank, .count{
                    color: #fff;
                    text-align: center;
                }

                .rank{
                    margin-top: size(15px);
                    font-size: size(26px);
                }
            }
        }

        .rank_list_wrapper{
            &.second {
                width: size(460px);
            }

            .item{
                flex: 1;
                vertical-align: bottom;
                
                text-align: center;
                .rank_wrapper{
                    width: size(60px);
                    height: size(50px);
                    position: relative;
                    text-align: center;
                    line-height: size(50px);
                    margin: 0 auto;
                    .hg_icon{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: -1;
                    }
                    z-index: 0;
                }

                .logo{
                    width: size(134px);
                    height: size(134px);
                    border-radius: 50%;
                    margin-top: size(-16px);
                    margin-bottom: size(-67px);
                    z-index: -1;
                }

                .count{
                    width: size(154px);
                    height: size(54px);
                    border-radius: size(29px);
                    font-size: size(32px);
                    text-align: center;
                    line-height: size(54px);
                    font-weight: bold;
                    margin: 0 auto;

                    &.rank1{
                        background: rgba(255, 143, 0, 0.6)
                    }

                    &.rank2{
                        background: rgba(62, 142, 249, 0.6)
                    }

                    &.rank3{
                        background: rgba(225, 94, 44, 0.6)
                    }
                }

                .name{
                    font-weight: bold;
                    font-size: size(34px);
                    padding-top: size(86px);
                    margin-bottom: size(20px);
                }

                .content_wrapper{
                    width: size(210px);
                    height: size(230px);
                    text-align: center;
                    position: relative;
                    margin: 0 auto;
                    .item_bg{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: -2;
                    }
                }
            
                &.f_rank{
                    .content_wrapper{
                        height: size(260px);
                    }
                }
            }
        }

        .user_rank_wrapper{
            background: #fff;
            margin-top: size(20px);
            .title{
                height: size(77px);
                display: flex;
                align-items: flex-end;
                justify-content: center;
                font-size: size(32px);
                color: #666666;
            }

            .tab_header_wrapper{
                width: size(750px);
                margin: 0 auto;

                height: size(90px);
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: size(2px) solid  #EEEEEE;

                &.one{
                    justify-content: center;
                    text-align: center;
                }

                &.two{
                    width: size(500px);
                }

                .item{
                    font-size: size(30px);
                    color: #9A9A9A;
                    cursor: pointer;
                    height: size(90px);
                    line-height: size(90px);
                    display: block;
                    //align-items: center;

                    &.active{
                        color: #222;
                        font-weight: bold;
                        border-bottom: size(4px) solid #ffa200;
                    }
                }
            }
            
            .user_rank_content{
                width: size(670px);
                margin: 0 auto;

                .item{
                    height: size(100px);
                    margin-top: size(40px);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .left{
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .avatar{
                            width: size(100px);
                            height: size(100px);
                            border-radius: 50%;
                            margin-left: size(40px);
                        }

                        .nick{
                            margin-left: size(24px);
                            font-size: size(30px);
                            color: #222;
                            max-width: size(300px);
                        }

                        .rank_wrapper{
                            width: size(34px);
                            height: size(51px);
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            .icon{
                                width: size(34px);
                                height: size(51px);
                                font-weight: bold;
                            
                            }

                            .text{
                                font-size: size(34px);
                                color: #8D8D8D;
                            }
                        }
                    }

                    .right{
                        .count{
                            font-size: size(50px);
                            color: #222222;
                            font-weight: bold;
                            margin-right: size(8px);
                        }

                        font-size: size(30px);
                        color: #2A2A2A;
                    }
                }
            }

            .empty_wrapper{
                display: flex;
                flex-direction: column;
                align-items: center;
                background: #f9f9f9;

                .icon{
                    width: size(170px);
                    height: size(170px);
                    margin-top: size(74px);
                    display: block;
                }

                .text{
                    font-size: size(32px);
                    color: #666666;
                    margin-top: size(20px);
                }
            }
        }

        .restart_btn{
            width: size(660px);
            height: size(90px);
            background: #FFA200;
            border-radius: 200px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: size(40px) auto 0;
            cursor: pointer;
        }
    }
</style>