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
  submit_hyExt_context_getLiveInfo () {
    this.log('获取当前直播间信息')
    global.hyExt.context.getLiveInfo().then(resp => {
      this.log('获取当前直播间信息成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前直播间信息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_getWeekRank () {
    this.log('获取当前直播间周贡榜数据')
    global.hyExt.context.getWeekRank().then(resp => {
      this.log('获取当前直播间周贡榜数据成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前直播间周贡榜数据失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_getFansRank () {
    this.log('获取当前直播间粉丝榜数据')
    global.hyExt.context.getFansRank().then(resp => {
      this.log('获取当前直播间粉丝榜数据成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前直播间粉丝榜数据失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_getVip () {
    this.log('获取当前直播间贵宾数据')
    global.hyExt.context.getVip().then(resp => {
      this.log('获取当前直播间贵宾数据成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前直播间贵宾数据失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_getStreamerInfo () {
    this.log('获取当前直播间主播信息')
    global.hyExt.context.getStreamerInfo().then(resp => {
      this.log('获取当前直播间主播信息成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前直播间主播信息失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.context.getLiveInfo</Text>
        <SubmitButton onPress={this.submit_hyExt_context_getLiveInfo.bind(this)}>获取当前直播间信息</SubmitButton>
        <Text style={styles.header}>hyExt.context.getWeekRank</Text>
        <SubmitButton onPress={this.submit_hyExt_context_getWeekRank.bind(this)}>获取当前直播间周贡榜数据</SubmitButton>
        <Text style={styles.header}>hyExt.context.getFansRank</Text>
        <SubmitButton onPress={this.submit_hyExt_context_getFansRank.bind(this)}>获取当前直播间粉丝榜数据</SubmitButton>
        <Text style={styles.header}>hyExt.context.getVip</Text>
        <SubmitButton onPress={this.submit_hyExt_context_getVip.bind(this)}>获取当前直播间贵宾数据</SubmitButton>
        <Text style={styles.header}>hyExt.context.getStreamerInfo</Text>
        <SubmitButton onPress={this.submit_hyExt_context_getStreamerInfo.bind(this)}>获取当前直播间主播信息</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}