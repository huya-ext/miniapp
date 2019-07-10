<template>
    <div class="dialog_wrapper" v-if="isShowDialog">
        <div class="mask" @click="hideDialog"></div>
        <div class="main_wrapper">
            <p class="title">添加选项</p>
            <div v-if="isDefaultTpl" class="content_wrapper">
                <input type="text" class="ipt" v-model="iptOptionName" placeholder="请填写选项内容">
            </div>

            <div v-else class="content_wrapper">
                <select v-model="choosedOptionItemId" class="ipt">
                    <option v-for="item in optionList" v-bind:value="item.optionId" :key="item.optionId">
                        {{item.optionName}}
                    </option>
                </select>
            </div>

            <div class="ok_btn" @click="saveOption">完成</div>
        </div>
    </div>
</template>

<script>
    import eventBus from '../assets/eventBus'
    import util from '../assets/util'

    export default {
        data() {
          return {
            isShowDialog: false,
            choosedOptionItemId: "",
            iptOptionName: ""
          } 
        },
        created() {
            console.log('弹窗create');

            eventBus.$on('showDialog', res => {
                console.log('监听到了');
                this.isShowDialog = true;
            })

            if(this.isDefaultTpl) {
                this.iptOptionName = "";
            }
        },
        destroyed() {
            eventBus.$off('showDialog');
        },
        props: ['choosedTplId', 'optionList', 'choosedOptionList'],
        computed: {
            isDefaultTpl() {
                return this.choosedTplId == -1; //当模板id为-1时 是默认的场景
            }
        },
        methods: {
            hideDialog() {
                this.isShowDialog = false;
            },
            saveOption() {
                var submitOptionName = this.iptOptionName ? this.iptOptionName.trim() : "";

                if(!this.isDefaultTpl) {
                    if(!this.choosedOptionItemId) {
                        util.showToast('请选择选项');
                        return;
                    }

                    const hasChoosedSameOption = this.choosedOptionList.some(item => item.optionId == this.choosedOptionItemId)
                    if(hasChoosedSameOption) {
                        util.showToast('不能选择相同选项');
                        return;
                    }
                }else{
                    if(!submitOptionName) {
                        util.showToast('请填写选项内容');
                        return;
                    }

                    if(submitOptionName.length > 7) {
                        util.showToast('选项内容长度不能超过7个字符哦~');
                        return;
                    }

                    const hasChoosedSameOption = this.choosedOptionList.some(item => item.optionName == submitOptionName);
                    if(hasChoosedSameOption) {
                        util.showToast('不能填写相同选项');
                        return;
                    }
                }
              
                eventBus.$emit('saveOption', {
                    choosedOptionId: this.choosedOptionItemId,
                    iptOptionName: submitOptionName
                });
                
                if(this.isDefaultTpl) {
                    this.iptOptionName = "";
                }else{
                    this.choosedOptionItemId = "";
                }
                
                this.hideDialog();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/scss/common';

    .dialog_wrapper{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 0;

        .mask{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            background: rgba(0, 0, 0, 0.5);
        }

        .main_wrapper{
            position: absolute;
            top: size(412px);
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
            width: size(656px);
            height: size(410px);
            background: #fff;
            border-radius: size(16px);

            .title{
                height: size(100px);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: size(36px);
                color: #333333;
                border-bottom: size(2px) solid  #E9E9E9;
            }

            .ok_btn{
                height: size(100px);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: size(34px);
                color: #ff8800;
                border-top: size(2px) solid  #E9E9E9;
                cursor: pointer;
            }

            .content_wrapper{
                display: flex;
                align-items: center;
                justify-content: center;
                height: size(206px);

                .ipt{
                    width: size(520px);
                    height: size(86px);
                    border-radius: size(4px);
                    text-indent: size(30px);
                    border: 0;
                    border: size(2px) solid #E7E7E7;
                }

                option::-ms-expand{ display: none; }

                option{
                   line-height: size(86px);
                   text-indent: size(30px);
                   -moz-appearance: none; /* Firefox */
                   -webkit-appearance: none; /* Safari 和 Chrome */
                   appearance: none;
                }
            }
        }
    }
</style>
