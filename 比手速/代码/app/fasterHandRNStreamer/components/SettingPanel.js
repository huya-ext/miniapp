import React, { Component } from 'react';
import { Text, Modal, View, Image, StyleSheet, ScrollView, Platform, ActionSheetIOS, TouchableWithoutFeedback, Picker, PickerIOS, ImageBackground, TouchableOpacity } from 'react-native';
import CONFIG from '../assets/config'
import eventBus from '../tools/bus'

import pxUtil from '../tools/px2dp'
const px2dp = pxUtil.px2dp

import util from '../assets/util'

export default class settingPanel extends Component {
    constructor(initialProps) {
      super();

      this.state = {
        actionTime: CONFIG.defaultActionTime,
        activeOptionId: '',
        activeOptionIdx: 0
      }

      this.chooseScene = this.chooseScene.bind(this);
      this.saveSettingConfig = this.saveSettingConfig.bind(this);
      this.addActionTime = this.addActionTime.bind(this);
      this.reduceActionTime = this.reduceActionTime.bind(this);

      this.showAddOptionDialog = this.showAddOptionDialog.bind(this);
      this.deleteOption = this.deleteOption.bind(this);
      this.startAction = this.startAction.bind(this);

      this.showIosSheet = this.showIosSheet.bind(this);
    }

    componentDidMount() {

    }

    saveSettingConfig() {
      const { choosedOptionList, choosedTplId } = this.props;
      const {actionTime} = this.state;

      const canSubmit = choosedOptionList.length > 0;
      
      if(!canSubmit) {
        util.showToast('请填写完整后保存配置');
        return;
      }

      if(this.isDefaultTpl()) {
          var paramList = choosedOptionList.map(item => {
            return {
                ...item,
                optionName: util.xssFilter(item.optionName),
                optionId: "" + item.optionId
            }
          })
      }else{
          var paramList = choosedOptionList.map(item => {
              return {
                ...item,
                optionId: "" + item.optionId
              }
          })
      }

      console.log('保存的数据为', paramList, actionTime, choosedTplId);      

      util.request({
          service: 'saveRaceConfig',
          method: 'POST',
          param: {
            raceTime: actionTime,
            templateId: choosedTplId,
            options: JSON.stringify(paramList)
          }
      })
      .then(res => {
          if(res.status === 0 && res.data) {
            eventBus.emit('saveSettingConfig', {
              actionTime,
              raceId: res.data.raceId
            })

            util.showToast('已成功保存');
          }else{  
            util.showToast(res.msg);
          }

          console.log('保存结果', res);
      }).catch(error => {
        console.log('保存结果异常', error);
      })
    }

    isDefaultTpl() {
      const { choosedTplId } = this.props;
      return choosedTplId == -1;
    }

    chooseScene(templateId) {
      const {choosedTplId} = this.props;
      if(templateId != choosedTplId) {
        eventBus.emit('changeTpl',  templateId);
      }
    }

    showAddOptionDialog() {
      eventBus.emit('showAddOptionDialog');
    }

    showIosSheet() {
      const {tplOptionList} = this.props;
      let sheetOptions = tplOptionList.map(item => item.templateName);

      sheetOptions.push('取消');

      ActionSheetIOS.showActionSheetWithOptions({
        options: sheetOptions,
        title: "选择场景",
        cancelButtonIndex: sheetOptions.length - 1,
      }, btnIdx => {
        if(btnIdx != (sheetOptions.length - 1)) {
          this.chooseScene(tplOptionList[btnIdx].templateId);
        }
      })
    }

    deleteOption(idx) {
      console.log('点击了删除', idx);
      eventBus.emit('deleteOption', idx);
    }   

    reduceActionTime() {
      var {actionTime} = this.state;
      if(actionTime <= CONFIG.minSettingActionTime) {
        return;
      }

      actionTime--;

      this.setState({
        actionTime
      })
    }

    addActionTime() {
      var {actionTime} = this.state;
      if(actionTime >= CONFIG.maxSettingActionTime) {
        return;
      }

      actionTime++;

      this.setState({
        actionTime
      })
    }

    startAction() {
      const {raceId, choosedOptionList} = this.props;

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

              eventBus.emit('startReadyTimeCountDown');
          }else{
              util.showToast(res.msg);
          }

          console.log('开始启动', res)
      })
    }

    render() {
      const { tplOptionList, choosedTplId, choosedOptionList, choosedTplName, raceId } = this.props;
      const { actionTime } = this.state;

      const selectedItem = tplOptionList.find(item => item.templateId == choosedTplId);

      return(
        <View style={styles.settingPanel}>
            <Image 
            source={require('../assets/img/setting_bg.png')}           
            resizeMode='cover'
            style={styles.settingBg}
            ></Image>

            <View style={styles.mainWrapper}>
                <View style={styles.sceneWrapper}>
                    <Text style={styles.desc}>选择场景13</Text>
                    {
                      selectedItem && Platform.OS != 'ios' &&
                      <Picker
                        selectedValue={selectedItem.templateId}
                        style={styles.ipt}
                        onValueChange={ (value) => this.chooseScene(value)}
                      >

                        {
                            tplOptionList.map((item, idx) => {
                                return(
                                  <Picker.Item value={item.templateId} label={item.templateName} key={item.templateId}/>
                                )
                            })
                        }
                      </Picker>
                    }

                    {
                      selectedItem && Platform.OS == 'ios' && 
                      <TouchableOpacity onPress={this.showIosSheet}>
                        <View style={styles.iosPickerWrapper}>
                          <Text style={styles.iosPickerWrapperText}>{choosedTplName}</Text>
                          <Image source={require('../assets/img/arrow_icon.png')} style={styles.iosPickerWrapperIcon}></Image>
                        </View>
                      </TouchableOpacity>
                    }
                </View>

                <View style={styles.addOptionWrapper}>
                    <Text style={styles.desc}>选项设置</Text>
                    <View style={styles.optionListWrapper}>
                        {
                          choosedOptionList.map((item, idx) => {
                            return(
                              <View style={styles.optionItem} key={item.optionName}>
                                <Image style={[styles.logo, !item.optionLogo ? styles.hide : '']} source={item.optionLogo ? {uri: item.optionLogo} : null}></Image>
                                <Text style={styles.name}>{item.optionName}</Text>

                               <TouchableOpacity onPress={() => {this.deleteOption(idx)}} style={styles.deleteBtnWrapper}>
                                  <Image style={styles.deleteBtn} source={require('../assets/img/delete_icon.png')}></Image>
                                </TouchableOpacity>
                              </View>
                            )
                          })
                        }

                        <TouchableWithoutFeedback onPress={this.showAddOptionDialog}>
                          <View style={styles.addItemWrapper}>
                            <Text>
                              +添加
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>

                    </View>
                </View>

                <View style={styles.timeWrapper}>
                  <Text style={styles.desc}>持续时长</Text>
                  
                 
                  <TouchableWithoutFeedback onPress={this.reduceActionTime}>
                    <View style={styles.reduceIconWrapper}>
                      <Image source={require('../assets/img/reduce_icon.png')} style={styles.reduceIconWrapperIcon}></Image>
                    </View>
                  </TouchableWithoutFeedback>

                  <View style={styles.timeCountWrapper}>
                    <Text style={styles.timeCount}>{actionTime}</Text>
                  </View>
                  
                  <TouchableWithoutFeedback onPress={this.addActionTime}>
                    <View style={styles.addIconWrapper}>
                      <Image source={require('../assets/img/add_icon.png')} style={styles.addIconWrapperIcon}></Image> 
                    </View>
                  </TouchableWithoutFeedback>
                </View>
            </View>

            <View style={styles.btnWrapper}>
                <TouchableOpacity onPress={this.saveSettingConfig}>
                  <View style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>保存</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.startAction}>
                  <View style={[styles.startBtn, !raceId ? styles.disabledStartBtn : '']}>
                    <Text style={styles.startBtnText}>启动</Text>
                  </View>
                </TouchableOpacity>
            </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  settingPanel: {
    width: px2dp(750),
    alignItems: "center",
    zIndex: 1,
    backgroundColor: '#F9F9F9'
  },
  settingBg: {
    width: '100%',
    height: px2dp(424)
  },
  mainWrapper: {
    width: px2dp(670),
    marginTop: px2dp(-300),
    backgroundColor: "#fff",
    borderRadius: px2dp(20)
  },
  sceneWrapper: {
    width: px2dp(590),
    display: "flex",
    alignItems: "center",
    flexDirection: 'row',
    marginTop: px2dp(70)
  },
  addOptionWrapper: {
    width: px2dp(590),
    paddingBottom: px2dp(60),
    // height: px2dp(200),
    flexDirection:'row',
    marginTop: px2dp(60)
  },
  timeWrapper: {
    width: px2dp(590),
    display: "flex",
    alignItems: "center",
    flexDirection:'row',
    marginBottom: px2dp(70)
  },
  desc: {
    fontSize: px2dp(30),
    color: '#666666',
    marginLeft: px2dp(40),
    width: px2dp(140)
  },
  optionWrapper: {
    width: px2dp(435),
    height: px2dp(86),
    borderRadius: px2dp(8)
  },
  optionListWrapper: {
    flexDirection: "row",
    marginBottom: px2dp(-40),
    marginLeft: px2dp(-23),
    flexWrap: 'wrap'
  },
  optionItem: {
    color: '#234211',
    width: px2dp(206),
    height: px2dp(86),
    borderColor: "#E7E7E7",
    borderWidth: px2dp(1),
    borderStyle: "solid",
    borderRadius: px2dp(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: px2dp(40),
    marginLeft: px2dp(23)
  },
  logo: {
    width: px2dp(50),
    height: px2dp(50),
    marginRight: px2dp(15),
    borderRadius: px2dp(50)
  },
  hide: {
    display: 'none'
  },  
  name: {
    fontSize: px2dp(26)
  },
  deleteBtnWrapper: {
    position: 'absolute',
    right: px2dp(-14),
    top: px2dp(-14)
  },
  deleteBtn: {
    width: px2dp(34),
    height: px2dp(34)
  },
  addItemWrapper: {
    width: px2dp(206),
    height: px2dp(86),
    display: 'flex',
    flexDirection:'row',
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: px2dp(8),
    marginBottom: px2dp(40),
    marginLeft: px2dp(23),
    borderWidth: px2dp(2),
    borderStyle: "dashed",
    borderColor: "#E7E7E7"
  },
  btnWrapper: {
    justifyContent: 'space-between',
    flexDirection: "row",
    width: px2dp(670),
    marginTop: px2dp(70),
    paddingBottom: px2dp(70)
  },
  reduceIconWrapper: {
    width: px2dp(86),
    height: px2dp(86),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9'
  },
  reduceIconWrapperIcon: {
    width: px2dp(30),
    height: px2dp(5),
  },
  addIconWrapper: {
    width: px2dp(86),
    height: px2dp(86),
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: '#F9F9F9'
  },
  addIconWrapperIcon: {
    width: px2dp(26),
    height: px2dp(28)
  },
  timeCountWrapper: {
    borderWidth: px2dp(2),
    borderStyle: "solid",
    borderColor: "#E7E7E7",
    borderRadius: px2dp(8),
    marginLeft: px2dp(28),
    marginRight: px2dp(28),
    width: px2dp(86),
    height: px2dp(86),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeCount: {
    fontSize: px2dp(30)
  },
  saveBtn: {
    width: px2dp(315),
    height: px2dp(90),
    borderRadius: px2dp(200),
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  saveBtnText: {
    color: '#FFA200',
    fontSize: px2dp(32)
  },
  startBtn: {
    width: px2dp(315),
    height: px2dp(90),
    borderRadius: px2dp(200),
    backgroundColor: '#FFA200',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flex: 1
  },
  disabledStartBtn: {
    backgroundColor: '#e5e5e5',
    color: '#999999'
  },
  startBtnText: {
    color: '#fff',
    fontSize: px2dp(32)
  },
  ipt: {
    width: px2dp(320),
    height: px2dp(86)
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