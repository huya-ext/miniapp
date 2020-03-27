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
  submit_hyExt_player_getFrameData () {
    this.log('获取当前直播间当前的视频帧信息')
    global.hyExt.player.getFrameData().then(resp => {
      this.log('获取当前直播间当前的视频帧信息成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前直播间当前的视频帧信息失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.player.getFrameData</Text>
        <SubmitButton onPress={this.submit_hyExt_player_getFrameData.bind(this)}>获取当前直播间当前的视频帧信息</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}