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
  submit_hyExt_action_showEntrance () {
    let args = []
    args[0] = {}
    args[0].extTypes = this.state.hyExt_action_showEntrance_0_extTypes ? this.state.hyExt_action_showEntrance_0_extTypes.join(',') : ""
    args[0].countDown = Number(this.state.hyExt_action_showEntrance_0_countDown) || 0
    args[0].cornerMarkId = this.state.hyExt_action_showEntrance_0_cornerMarkId || ""
    this.log('显示客户端小程序入口：' + JSON.stringify(args))
    global.hyExt.action.showEntrance(args[0]).then(() => {
      this.log('显示客户端小程序入口成功')
    }).catch(err => {
      this.log('显示客户端小程序入口失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_action_hideEntrance () {
    let args = []
    args[0] = {}
    args[0].extTypes = this.state.hyExt_action_hideEntrance_0_extTypes ? this.state.hyExt_action_hideEntrance_0_extTypes.join(',') : ""
    this.log('隐藏客户端小程序入口：' + JSON.stringify(args))
    global.hyExt.action.hideEntrance(args[0]).then(() => {
      this.log('隐藏客户端小程序入口成功')
    }).catch(err => {
      this.log('隐藏客户端小程序入口失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.action.showEntrance</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='extTypes'>     
            <Checkbox
              value={this.state.hyExt_action_showEntrance_0_extTypes || []}
              onChange={v => this.setState({ hyExt_action_showEntrance_0_extTypes: v })}
              iconPosition='left'>
              <Checkbox.Item label='虎牙主站-面板' value='web_video_com' />
              <Checkbox.Item label='虎牙直播APP-面板' value='app_panel' />
            </Checkbox>
          </FormItem>
          <FormItem label='countDown'>
            <Input placeholder='请输入倒计时（尚未提供）'
              value={this.state.hyExt_action_showEntrance_0_countDown || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_action_showEntrance_0_countDown: v })} />
          </FormItem>
          <FormItem label='cornerMarkId'>
            <Select data={[{"label":"无","value":""},{"label":"火","value":"fire"},{"label":"新","value":"new"}]}
              header='角标类型（尚未提供）'
              value={this.state.hyExt_action_showEntrance_0_cornerMarkId || ""}
              onPressConfirm={v => this.setState({ hyExt_action_showEntrance_0_cornerMarkId: v.value })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_action_showEntrance.bind(this)}>显示客户端小程序入口</SubmitButton>
        <Text style={styles.header}>hyExt.action.hideEntrance</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='extTypes'>     
            <Checkbox
              value={this.state.hyExt_action_hideEntrance_0_extTypes || []}
              onChange={v => this.setState({ hyExt_action_hideEntrance_0_extTypes: v })}
              iconPosition='left'>
              <Checkbox.Item label='虎牙主站-面板' value='web_video_com' />
              <Checkbox.Item label='虎牙直播APP-面板' value='app_panel' />
            </Checkbox>
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_action_hideEntrance.bind(this)}>隐藏客户端小程序入口</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}