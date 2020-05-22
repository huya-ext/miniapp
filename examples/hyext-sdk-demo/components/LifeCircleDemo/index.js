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
  submit_hyExt_onLoad () {
    let args = []
    args[0] = this.commonLog
    this.log('监听小程序onLoad生命周期')
    global.hyExt.onLoad(args[0])
  }
  submit_hyExt_onEnterForeground () {
    let args = []
    args[0] = this.commonLog
    this.log('监听onEnterForeground生命周期')
    global.hyExt.onEnterForeground(args[0])
  }
  submit_hyExt_onLeaveForeground () {
    let args = []
    args[0] = this.commonLog
    this.log('监听onLeaveForeground生命周期')
    global.hyExt.onLeaveForeground(args[0])
  }
  submit_hyExt_onAppear () {
    let args = []
    args[0] = this.commonLog
    this.log('监听onAppear生命周期')
    global.hyExt.onAppear(args[0])
  }
  submit_hyExt_onDisappear () {
    let args = []
    args[0] = this.commonLog
    this.log('监听onDisappear生命周期')
    global.hyExt.onDisappear(args[0])
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.onLoad</Text>
        <SubmitButton onPress={this.submit_hyExt_onLoad.bind(this)}>监听小程序onLoad生命周期</SubmitButton>
        <Text style={styles.header}>hyExt.onEnterForeground</Text>
        <SubmitButton onPress={this.submit_hyExt_onEnterForeground.bind(this)}>监听onEnterForeground生命周期</SubmitButton>
        <Text style={styles.header}>hyExt.onLeaveForeground</Text>
        <SubmitButton onPress={this.submit_hyExt_onLeaveForeground.bind(this)}>监听onLeaveForeground生命周期</SubmitButton>
        <Text style={styles.header}>hyExt.onAppear</Text>
        <SubmitButton onPress={this.submit_hyExt_onAppear.bind(this)}>监听onAppear生命周期</SubmitButton>
        <Text style={styles.header}>hyExt.onDisappear</Text>
        <SubmitButton onPress={this.submit_hyExt_onDisappear.bind(this)}>监听onDisappear生命周期</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}