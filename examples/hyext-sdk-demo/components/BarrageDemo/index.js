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
  submit_hyExt_context_leadBarrage () {
    this.log('引导当前用户发送弹幕')
    global.hyExt.context.leadBarrage().then(() => {
      this.log('引导当前用户发送弹幕成功')
    }).catch(err => {
      this.log('引导当前用户发送弹幕失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_onBarrageChange () {
    let args = []
    args[0] = {}
    args[0].sendNick = this.state.hyExt_context_onBarrageChange_0_sendNick || ""
    args[0].content = this.state.hyExt_context_onBarrageChange_0_content || ""
    args[0].nobleLevel = Number(this.state.hyExt_context_onBarrageChange_0_nobleLevel) || 0
    args[0].fansLevel = Number(this.state.hyExt_context_onBarrageChange_0_fansLevel) || 0
    args[1] = this.commonLog
    this.log('监听弹幕消息：' + JSON.stringify(args))
    global.hyExt.context.onBarrageChange(args[0], args[1]).then(() => {
      this.log('监听弹幕消息成功')
    }).catch(err => {
      this.log('监听弹幕消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_offBarrageChange () {
    this.log('取消监听弹幕消息')
    global.hyExt.context.offBarrageChange().then(() => {
      this.log('取消监听弹幕消息成功')
    }).catch(err => {
      this.log('取消监听弹幕消息失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.context.leadBarrage</Text>
        <SubmitButton onPress={this.submit_hyExt_context_leadBarrage.bind(this)}>引导当前用户发送弹幕</SubmitButton>
        <Text style={styles.header}>hyExt.context.onBarrageChange</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='sendNick'>
            <Input placeholder='请输入用户昵称'
              value={this.state.hyExt_context_onBarrageChange_0_sendNick || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_onBarrageChange_0_sendNick: v })} />
          </FormItem>
          <FormItem label='content'>
            <Input placeholder='请输入弹幕内容'
              value={this.state.hyExt_context_onBarrageChange_0_content || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_onBarrageChange_0_content: v })} />
          </FormItem>
          <FormItem label='nobleLevel'>
            <Input placeholder='请输入贵族等级'
              value={this.state.hyExt_context_onBarrageChange_0_nobleLevel || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_onBarrageChange_0_nobleLevel: v })} />
          </FormItem>
          <FormItem label='fansLevel'>
            <Input placeholder='请输入粉丝等级'
              value={this.state.hyExt_context_onBarrageChange_0_fansLevel || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_onBarrageChange_0_fansLevel: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_context_onBarrageChange.bind(this)}>监听弹幕消息</SubmitButton>
        <Text style={styles.header}>hyExt.context.offBarrageChange</Text>
        <SubmitButton onPress={this.submit_hyExt_context_offBarrageChange.bind(this)}>取消监听弹幕消息</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}