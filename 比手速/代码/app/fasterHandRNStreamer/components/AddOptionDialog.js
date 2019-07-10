import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TextInput, ActionSheetIOS, Picker, Platform, TouchableOpacity } from 'react-native';
import hyExt from 'hyliveext-rn-sdk';
import pxUtil from '../tools/px2dp'
const px2dp = pxUtil.px2dp

import CONFIG from '../assets/config'
import eventBus from '../tools/bus'

import util from '../assets/util'

export default class addOptionDialog extends Component {
    constructor(initialProps) {
      super();

      this.state = {
        choosedOptionItemId: "",
        iptOptionName: ""
      };

      this.saveOption = this.saveOption.bind(this);
      this.showIosSheet = this.showIosSheet.bind(this);
    }

    componentDidMount() {
      if(this.isDefaultTpl()) {
        this.setState({
            iptOptionName: ""
        })
      }else{ 
        const optionList = this.getChoosedOptionRangeList();
        this.setState({
            choosedOptionItemId: optionList[0].optionId,
            iptOptionName: optionList[0].optionName
        })

        console.log('页面加载', optionList[0].optionId);
      }
    } 

    isDefaultTpl() {
        const { choosedTplId } = this.props;
        return choosedTplId == -1;
    }

    saveOption() {
        const {iptOptionName, choosedOptionItemId} = this.state;
        const {choosedOptionList} = this.props;

        var submitOptionName = iptOptionName ? iptOptionName.trim() : "";

        console.log('点击了完成选项', submitOptionName, choosedOptionList, iptOptionName, choosedOptionItemId)
        if(!this.isDefaultTpl()) {
            if(!choosedOptionItemId) {
                util.showToast('请选择选项');
                return;
            }

            const hasChoosedSameOption = choosedOptionList.some(item => item.optionId == choosedOptionItemId)
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

            const hasChoosedSameOption = choosedOptionList.some(item => item.optionName == submitOptionName);
            if(hasChoosedSameOption) {
                util.showToast('不能填写相同选项');
                return;
            }
        }
      
        eventBus.emit('saveOption', {
            choosedOptionId: choosedOptionItemId,
            iptOptionName: submitOptionName
        });
        
        if(this.isDefaultTpl()) {
            this.setState({
                iptOptionName: ""
            })
        }else{
            this.setState({
                choosedOptionItemId: ""
            })
        }
        
        this.hideDialog();
    }


    hideDialog() {
        eventBus.emit('hideAddOptionDialog');
    }

    changeSelectOption(idx) {
        const optionList = this.getChoosedOptionRangeList();

        console.log('选项是', idx, optionList[idx]);

        this.setState({
            choosedOptionItemId: optionList[idx].optionId,
            iptOptionName: optionList[idx].optionName
        })
    }

    getChoosedOptionRangeList() {
        const {tplOptionList, choosedTplId} = this.props;
        var findedItem = tplOptionList.find(item => item.templateId == choosedTplId);

        return findedItem ? findedItem.options : [];
    }

    showIosSheet() {
        const optionList = this.getChoosedOptionRangeList();
        let sheetOptions = optionList.map(item => item.optionName);

        sheetOptions.push('取消');

        ActionSheetIOS.showActionSheetWithOptions({
            options: sheetOptions,
            title: "添加选项",
            cancelButtonIndex: sheetOptions.length - 1,
        }, btnIdx => {
            if(btnIdx != (sheetOptions.length - 1)) {
              this.changeSelectOption(btnIdx);
            }
        })
    }

    render() {
      const { iptOptionName, choosedOptionItemId } = this.state;
      const {choosedTplId, tplOptionList} = this.props;
      
      const optionList = this.getChoosedOptionRangeList();
      const isAdr = Platform.OS  != 'ios';

      console.log('传递的数据', choosedTplId, tplOptionList, optionList);

      return(
        <View style={styles.dialogWrapper}>
            <View style={styles.mainWrapper}>
                <View style={styles.titleWrapper}>
                    <Text  style={styles.title}>添加选项 </Text>
                </View>

                {
                    this.isDefaultTpl() ?
                    <View style={styles.contentWrapper}>
                        <TextInput onChangeText = {(text) => text && this.setState({iptOptionName: text})} style={styles.ipt} placeholder="请填写选项内容"/>
                    </View>
                    :
                    (
                        isAdr ?
                        (
                            <View style={styles.contentWrapper}>
                                {
                                    optionList && optionList.length &&
                                    <Picker   
                                        selectedValue={choosedOptionItemId}
                                        style={styles.ipt}
                                        onValueChange={(optionId, idx) => {this.changeSelectOption(idx)}}
                                    >
                                        {
                                            optionList.map((item, idx) => {
                                                return(
                                                    <Picker.Item value={item.optionId} label={item.optionName} key={item.optionId} />
                                                )
                                            })
                                        }
                                    </Picker>
                                }
                        
                            </View>
                        )
                        :
                        <TouchableOpacity onPress={this.showIosSheet} style={styles.contentWrapper}>
                            <View style={styles.iosPickerWrapper}>
                                <Text style={styles.iosPickerWrapperText}>{iptOptionName}</Text>
                                <Image source={require('../assets/img/arrow_icon.png')} style={styles.iosPickerWrapperIcon}></Image>
                            </View>
                        </TouchableOpacity>
                       
                    )
   
                } 

                <TouchableOpacity onPress={this.saveOption}>
                    <View style={styles.okBtnWrapper}>
                        <Text style={styles.okBtn} >
                            完成
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
    dialogWrapper: {
        position: 'absolute',
        // top: 0,
        width: px2dp(656),
        height: px2dp(410),
        left: '50%',
        top: px2dp(100),
        marginLeft: px2dp(-328),
        // bottom: 0,
        // right: 0,
        zIndex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainWrapper: {
        width: px2dp(656),
        height: px2dp(410),
        backgroundColor: '#fff',
        borderRadius: px2dp(16),
        textAlign: 'center'
    },
    titleWrapper: {
        height: px2dp(100),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: px2dp(1),
        borderStyle: "solid",
        borderColor: "#E9E9E9"
    },
    title: {
        fontSize: px2dp(36),
        color: '#333333'
    },
    contentWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: px2dp(206),
        flexDirection: 'row'
    },
    okBtnWrapper: {
        height: px2dp(100),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: px2dp(1),
        borderTopColor: '#E9E9E9',
        borderStyle: "solid"
    },
    okBtn: {
        fontSize: px2dp(34),
        color: '#ff8800'
    },
    ipt: {
        width: px2dp(520),
        height: px2dp(86),
        borderRadius: px2dp(4),
        borderWidth: px2dp(1),
        borderStyle: "solid",
        borderColor: "#E7E7E7"
    },
    iosPickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#E7E7E7',
        borderWidth: px2dp(1),
        borderStyle: 'solid',
        height: px2dp(95),
        justifyContent: 'space-between',
        width: px2dp(435),
        borderRadius: px2dp(8)
    },
    iosPickerWrapperText: {
        fontSize: px2dp(30),
        color: '#222',
        marginLeft: px2dp(28)
    },
    iosPickerWrapperIcon: {
        width: px2dp(22),
        height: px2dp(12),
        marginRight: px2dp(28)
    }
})