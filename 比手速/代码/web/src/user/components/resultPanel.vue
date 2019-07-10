<template>
    <div :class="{wait: !result}" class="main_wrapper"> 
        <div v-if="!result" class="result_wrapper">
            <ul class="wait_list_wrapper clearfix">
                <li v-for="item in waitResult" :key="item.optionId" class="item" :class="{f_rank: item.rank == 1}">
                    <p class="rank">{{item.rank}}</p>
                    <img :src="trimHttp(item.optionLogo)" class="bg">
                    <p class="name">{{item.optionName}}</p>
                </li> 
            </ul>

            <div class="wait_panel" v-if="!result">
                <img src="../assets/img/wait_hy_icon.png" class="icon"> 
                <span class="text">稍作等候，马上开始了~</span>
            </div>
        </div>

        <div v-else>
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

                <div v-if="!isLastResult" class="result_total_wrapper">
                    您手速惊人，一共点击了
                    <span class="count">{{pickTotalNum}}</span>
                    次
                </div>
            </div>

            <div class="user_rank_wrapper">
                <p class="title">Top5手速榜</p>

                <ul class="tab_header_wrapper">
                    <li v-for="(item, idx) in result" :key="item.optionId" class="item" :class="{active: idx == activeOptionIdx}" @click="switchPanel(idx)">
                        <span class="name">{{item.optionName}}</span>
                    </li>
                </ul>
                
                <ul class="user_rank_content" v-if="activeUserRankList.length > 0">
                    <li v-for="(item, idx) in activeUserRankList" :key="item.uid" class="item">
                        <div class="left">  
                            <div class="rank_wrapper">
                                <img :src="require(`../assets/img/rank_icon${idx+1}.png`)" class="icon" v-if="idx <= 2">
                                <span v-else class="text">{{idx+1}}</span>
                            </div> 
                            <img :src="trimHttp(item.logo)" class="avatar">
                            <span class="nick">{{item.nick}}</span>
                        </div>

                        <div class="right">
                            <span class="count">{{item.voteCnt}}</span>次
                        </div>
                    </li> 
                </ul>

                <div class="empty_wrapper" v-else>
                    <img src="../assets/img/wait_hy_icon.png" class="icon"> 
                    <span class="text">暂无人上榜</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CONFIG from '../assets/config'

    import util from '../assets/util'

    const { settingStateMap } = CONFIG;

    export default {
        data() {
            return {
                waitResult: [2, 1, 3],
                activeOptionIdx: 0
            }
        },  
        created() {
            this.waitResult = this.waitResult.map((item, index) => {
                return {
                    optionLogo: require(`../assets/img/wait_result_icon${item}.png`),
                    optionName: '虚位以待',
                    rank: item
                }
            })

            
        },
        methods: {
            trimHttp(url) {
                if(!url) {
                    return require('../assets/img/default_logo.png');
                }else{
                    return util.trimHttp(url);
                }
            },
            switchPanel(idx) {
                this.activeOptionIdx = idx;
            }
        },
        props: {
            result: {
                type: Array,
                value: []
            },
            pickTotalNum: {
                type: Number,
                value: 0
            },
            settingState: {
                type: Number,
                value: settingStateMap.lastResult
            }
        },
        computed: {
            isLastResult() {
                return this.settingState == settingStateMap.lastResult;
            },
            activeUserRankList() {
                if(this.result) {
                    return this.result[this.activeOptionIdx].userRank;
                }
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
            }
        }
    }
</script>

<style scoped lang="scss">

    @import '../assets/scss/common.scss';
    .ellipsis{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .main_wrapper{
        background: #F9F9F9;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .result_wrapper{
        width: 100%;
        height: size(447px);
        background: linear-gradient(-180deg, #E1EAFF 0%, #FFFFFF 73%);
        &.current{
            height: size(528px);
        }
    }

    .wait_list_wrapper, .rank_list_wrapper {
        list-style: none;
        position: relative;
        width: size(670px);
        margin: 0 auto;
        z-index: 0;
        padding-top: size(36px);
        padding-bottom: size(30px);

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
                margin-top: size(12px);
                font-size: size(26px);
            }
        }
    }

    .wait_list_wrapper{
        .item{
            width: size(210px);
            height: size(336px);

            &.f_rank{
                height: size(377px);
                // margin-left: size(19px);
                // margin-right: size(19px);
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

    .wait_panel, .empty_wrapper{
        display: flex;
        flex-direction: column;
        align-items: center;

        .icon{
            width: size(170px);
            height: size(170px);
            margin-top: size(211px);
        }

        .text{
            font-size: size(32px);
            color: #666666;
            margin-top: size(20px);
        }
    }

    .empty_wrapper{
        background: #f9f9f9;
        .icon{
            margin-top: size(114px);
        }
    }

    .result_total_wrapper{
        text-align: center;
        font-size: size(32px);
        color: #222222;
        padding-bottom: size(39px);
        
        .count{
            font-size: size(50px);
            color: #FFA200;
            font-weight: bold;
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
                word-wrap: break-word;
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
        // padding-bottom: size(20px);

        .title{
            height: size(72px);
            display: flex;
            align-items: flex-end;
            justify-content: center;
            font-size: size(32px);
            color: #666666;
        }

        .tab_header_wrapper{
            height: size(90px);
            display: flex;
            align-items: center;
            justify-content: space-around;
            border-bottom: size(2px) solid  #EEEEEE;

            .item{
                font-size: size(30px);
                color: #9A9A9A;
                height: 100%;
                display: flex;
                align-items: center;
                // justify-content: center;
                // flex: 1;
                cursor: pointer;
                
                &.active{
                    color: #222;
                    border-bottom: size(3px) solid #ffa200;
                    font-weight: bold;
                }
            }
        }
        
        .user_rank_content{
            width: size(670px);
            margin: 0 auto;
            padding-bottom: size(40px);
            
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
                            width: size(40px);
                            height: size(54px);
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
    }
</style>
