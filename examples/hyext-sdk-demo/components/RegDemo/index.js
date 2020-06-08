import React, { Component } from 'react'
import { UI } from '@hyext/hy-ui'

import styles from '../../common/styles'
import FormItem from '../../common/FormItem'
import SubmitButton from '../../common/SubmitButton'
import LogPanel from '../../common/LogPanel'
import Select from '../../common/Select'

const { Text, Form, Input, ScrollView, Switch, Checkbox } = UI

export default class Demo extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }

    this.commonLog = ((...args) => {
      this.log('触发回调：' + JSON.stringify(args))
    }).bind(this)
  }
  submit_hyExt_reg_onSpeechRecognition () {
    let args = []
    args[0] = {}
    args[0].hotwords = this.state.hyExt_reg_onSpeechRecognition_0_hotwords ? this.state.hyExt_reg_onSpeechRecognition_0_hotwords.split(',') : []
    args[0].callback = this.commonLog
    this.log('监听当前直播间语音识别消息：' + JSON.stringify(args))
    global.hyExt.reg.onSpeechRecognition(args[0]).then(() => {
      this.log('监听当前直播间语音识别消息成功')
    }).catch(err => {
      this.log('监听当前直播间语音识别消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_reg_offSpeechRecognition () {
    this.log('取消监听当前直播间语音识别消息')
    global.hyExt.reg.offSpeechRecognition().then(() => {
      this.log('取消监听当前直播间语音识别消息成功')
    }).catch(err => {
      this.log('取消监听当前直播间语音识别消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_reg_onGestureRecognition () {
    let args = []
    args[0] = {}
    args[0].callback = this.commonLog
    this.log('监听当前直播间手势识别消息：' + JSON.stringify(args))
    global.hyExt.reg.onGestureRecognition(args[0]).then(() => {
      this.log('监听当前直播间手势识别消息成功')
    }).catch(err => {
      this.log('监听当前直播间手势识别消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_reg_offGestureRecognition () {
    this.log('取消监听当前直播间手势识别消息')
    global.hyExt.reg.offGestureRecognition().then(() => {
      this.log('取消监听当前直播间手势识别消息成功')
    }).catch(err => {
      this.log('取消监听当前直播间手势识别消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_reg_onHumanContourDetection () {
    let args = []
    args[0] = {}
    args[0].callback = this.commonLog
    this.log('监听当前直播间人体轮廓点检测消息：' + JSON.stringify(args))
    global.hyExt.reg.onHumanContourDetection(args[0]).then(() => {
      this.log('监听当前直播间人体轮廓点检测消息成功')
    }).catch(err => {
      this.log('监听当前直播间人体轮廓点检测消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_reg_offHumanContourDetection () {
    this.log('取消监听当前直播间人体轮廓点检测消息')
    global.hyExt.reg.offHumanContourDetection().then(() => {
      this.log('取消监听当前直播间人体轮廓点检测消息成功')
    }).catch(err => {
      this.log('取消监听当前直播间人体轮廓点检测消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_reg_onHumanSkeletonDetection () {
    let args = []
    args[0] = {}
    args[0].callback = this.commonLog
    this.log('监听当前直播间肢体骨骼点检测消息：' + JSON.stringify(args))
    global.hyExt.reg.onHumanSkeletonDetection(args[0]).then(() => {
      this.log('监听当前直播间肢体骨骼点检测消息成功')
    }).catch(err => {
      this.log('监听当前直播间肢体骨骼点检测消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_reg_offHumanSkeletonDetection () {
    this.log('取消监听当前直播间肢体骨骼点检测消息')
    global.hyExt.reg.offHumanSkeletonDetection().then(() => {
      this.log('取消监听当前直播间肢体骨骼点检测消息成功')
    }).catch(err => {
      this.log('取消监听当前直播间肢体骨骼点检测消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_reg_onFacialLandmarkDetection () {
    let args = []
    args[0] = {}
    args[0].callback = this.commonLog
    this.log('监听当前直播间人脸特征点检测消息：' + JSON.stringify(args))
    global.hyExt.reg.onFacialLandmarkDetection(args[0]).then(() => {
      this.log('监听当前直播间人脸特征点检测消息成功')
    }).catch(err => {
      this.log('监听当前直播间人脸特征点检测消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_reg_offFacialLandmarkDetection () {
    this.log('取消监听当前直播间人脸特征点检测消息')
    global.hyExt.reg.offFacialLandmarkDetection().then(() => {
      this.log('取消监听当前直播间人脸特征点检测消息成功')
    }).catch(err => {
      this.log('取消监听当前直播间人脸特征点检测消息失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.reg.onSpeechRecognition</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='hotwords'>
            <Input placeholder='请输入热词'
              value={this.state.hyExt_reg_onSpeechRecognition_0_hotwords || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_reg_onSpeechRecognition_0_hotwords: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_reg_onSpeechRecognition.bind(this)}>监听当前直播间语音识别消息</SubmitButton>
        <Text style={styles.header}>hyExt.reg.offSpeechRecognition</Text>
        <SubmitButton onPress={this.submit_hyExt_reg_offSpeechRecognition.bind(this)}>取消监听当前直播间语音识别消息</SubmitButton>
        <Text style={styles.header}>hyExt.reg.onGestureRecognition</Text>
        <SubmitButton onPress={this.submit_hyExt_reg_onGestureRecognition.bind(this)}>监听当前直播间手势识别消息</SubmitButton>
        <Text style={styles.header}>hyExt.reg.offGestureRecognition</Text>
        <SubmitButton onPress={this.submit_hyExt_reg_offGestureRecognition.bind(this)}>取消监听当前直播间手势识别消息</SubmitButton>
        <Text style={styles.header}>hyExt.reg.onHumanContourDetection</Text>
        <SubmitButton onPress={this.submit_hyExt_reg_onHumanContourDetection.bind(this)}>监听当前直播间人体轮廓点检测消息</SubmitButton>
        <Text style={styles.header}>hyExt.reg.offHumanContourDetection</Text>
        <SubmitButton onPress={this.submit_hyExt_reg_offHumanContourDetection.bind(this)}>取消监听当前直播间人体轮廓点检测消息</SubmitButton>
        <Text style={styles.header}>hyExt.reg.onHumanSkeletonDetection</Text>
        <SubmitButton onPress={this.submit_hyExt_reg_onHumanSkeletonDetection.bind(this)}>监听当前直播间肢体骨骼点检测消息</SubmitButton>
        <Text style={styles.header}>hyExt.reg.offHumanSkeletonDetection</Text>
        <SubmitButton onPress={this.submit_hyExt_reg_offHumanSkeletonDetection.bind(this)}>取消监听当前直播间肢体骨骼点检测消息</SubmitButton>
        <Text style={styles.header}>hyExt.reg.onFacialLandmarkDetection</Text>
        <SubmitButton onPress={this.submit_hyExt_reg_onFacialLandmarkDetection.bind(this)}>监听当前直播间人脸特征点检测消息</SubmitButton>
        <Text style={styles.header}>hyExt.reg.offFacialLandmarkDetection</Text>
        <SubmitButton onPress={this.submit_hyExt_reg_offFacialLandmarkDetection.bind(this)}>取消监听当前直播间人脸特征点检测消息</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}