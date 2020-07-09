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
  submit_hyExt_env_getVersionType () {
    this.log('获取当前小程序版本信息')
    global.hyExt.env.getVersionType().then(resp => {
      this.log('获取当前小程序版本信息成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前小程序版本信息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_env_getInitialParam () {
    this.log('获取当前小程序初始化参数')
    global.hyExt.env.getInitialParam().then(resp => {
      this.log('获取当前小程序初始化参数成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前小程序初始化参数失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_env_getHostInfo () {
    this.log('获取宿主信息')
    global.hyExt.env.getHostInfo().then(resp => {
      this.log('获取宿主信息成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取宿主信息失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.env.getVersionType</Text>
        <SubmitButton onPress={this.submit_hyExt_env_getVersionType.bind(this)}>获取当前小程序版本信息</SubmitButton>
        <Text style={styles.header}>hyExt.env.getInitialParam</Text>
        <SubmitButton onPress={this.submit_hyExt_env_getInitialParam.bind(this)}>获取当前小程序初始化参数</SubmitButton>
        <Text style={styles.header}>hyExt.env.getHostInfo</Text>
        <SubmitButton onPress={this.submit_hyExt_env_getHostInfo.bind(this)}>获取宿主信息</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}