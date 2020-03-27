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
  submit_hyExt_context_on () {
    let args = []
    args[0] = this.state.hyExt_context_on_0 || "subscribeSubmit"
    args[1] = this.commonLog
    this.log('监听宿主消息：' + JSON.stringify(args))
    global.hyExt.context.on(args[0], args[1])
  }
  submit_hyExt_context_off () {
    let args = []
    args[0] = this.state.hyExt_context_off_0 || "subscribeSubmit"
    args[1] = this.commonLog
    this.log('取消监听宿主消息：' + JSON.stringify(args))
    global.hyExt.context.off(args[0], args[1])
  }
  submit_hyExt_observer_on () {
    let args = []
    args[0] = this.state.hyExt_observer_on_0 || ""
    args[1] = this.commonLog
    this.log('监听小程序消息：' + JSON.stringify(args))
    global.hyExt.observer.on(args[0], args[1])
  }
  submit_hyExt_observer_off () {
    let args = []
    args[0] = this.state.hyExt_observer_off_0 || ""
    args[1] = this.commonLog
    this.log('取消监听小程序消息：' + JSON.stringify(args))
    global.hyExt.observer.off(args[0], args[1])
  }
  submit_hyExt_observer_emit () {
    let args = []
    args[0] = this.state.hyExt_observer_emit_0 || ""
    args[1] = this.state.hyExt_observer_emit_1 || ""
    this.log('触发小程序消息：' + JSON.stringify(args))
    global.hyExt.observer.emit(args[0], args[1]).then(() => {
      this.log('触发小程序消息成功')
    }).catch(err => {
      this.log('触发小程序消息失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.context.on</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='宿主消息名'>
            <Select data={[{"label":"【观众端】当前观众订阅状态发生变化","value":"subscribeSubmit"},{"label":"【观众端】当前观众送礼","value":"giftSubmit"},{"label":"当前用户发送弹幕","value":"barrageSubmit"},{"label":"beginLive（尚未提供）","value":"beginLive"},{"label":"endLive（尚未提供）","value":"endLive"},{"label":"viewportChange（尚未提供）","value":"viewportChange"},{"label":"videoStateChange（尚未提供）","value":"videoStateChange"},{"label":"videoFrameReduceStart（尚未提供）","value":"videoFrameReduceStart"},{"label":"videoFrameGrowEnd（尚未提供）","value":"videoFrameGrowEnd"},{"label":"obMatchBegin（尚未提供）","value":"obMatchBegin"},{"label":"obMatchEnd（尚未提供）","value":"obMatchEnd"},{"label":"perspectiveChange（尚未提供）","value":"perspectiveChange"}]}
              header='宿主消息名'
              value={this.state.hyExt_context_on_0 || "subscribeSubmit"}
              onPressConfirm={v => this.setState({ hyExt_context_on_0: v.value })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_context_on.bind(this)}>监听宿主消息</SubmitButton>
        <Text style={styles.header}>hyExt.context.off</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='宿主消息名'>
            <Select data={[{"label":"【观众端】当前观众订阅状态发生变化","value":"subscribeSubmit"},{"label":"【观众端】当前观众送礼","value":"giftSubmit"},{"label":"当前用户发送弹幕","value":"barrageSubmit"},{"label":"beginLive（尚未提供）","value":"beginLive"},{"label":"endLive（尚未提供）","value":"endLive"},{"label":"viewportChange（尚未提供）","value":"viewportChange"},{"label":"videoStateChange（尚未提供）","value":"videoStateChange"},{"label":"videoFrameReduceStart（尚未提供）","value":"videoFrameReduceStart"},{"label":"videoFrameGrowEnd（尚未提供）","value":"videoFrameGrowEnd"},{"label":"obMatchBegin（尚未提供）","value":"obMatchBegin"},{"label":"obMatchEnd（尚未提供）","value":"obMatchEnd"},{"label":"perspectiveChange（尚未提供）","value":"perspectiveChange"}]}
              header='宿主消息名'
              value={this.state.hyExt_context_off_0 || "subscribeSubmit"}
              onPressConfirm={v => this.setState({ hyExt_context_off_0: v.value })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_context_off.bind(this)}>取消监听宿主消息</SubmitButton>
        <Text style={styles.header}>hyExt.observer.on</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='小程序消息名'>
            <Input placeholder='请输入小程序消息名'
              value={this.state.hyExt_observer_on_0 || ''}
              onChange={v => this.setState({ hyExt_observer_on_0: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_observer_on.bind(this)}>监听小程序消息</SubmitButton>
        <Text style={styles.header}>hyExt.observer.off</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='小程序消息名'>
            <Input placeholder='请输入小程序消息名'
              value={this.state.hyExt_observer_off_0 || ''}
              onChange={v => this.setState({ hyExt_observer_off_0: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_observer_off.bind(this)}>取消监听小程序消息</SubmitButton>
        <Text style={styles.header}>hyExt.observer.emit</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='小程序消息名'>
            <Input placeholder='请输入小程序消息名'
              value={this.state.hyExt_observer_emit_0 || ''}
              onChange={v => this.setState({ hyExt_observer_emit_0: v })} />
          </FormItem>
          <FormItem label='小程序消息内容'>
            <Input placeholder='请输入小程序消息内容'
              value={this.state.hyExt_observer_emit_1 || ''}
              onChange={v => this.setState({ hyExt_observer_emit_1: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_observer_emit.bind(this)}>触发小程序消息</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}