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
  submit_hyExt_context_leadSubscribe () {
    this.log('引导当前观众订阅当前主播')
    global.hyExt.context.leadSubscribe().then(() => {
      this.log('引导当前观众订阅当前主播成功')
    }).catch(err => {
      this.log('引导当前观众订阅当前主播失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_getSubscribeInfo () {
    this.log('获取当前观众订阅状态')
    global.hyExt.context.getSubscribeInfo().then(resp => {
      this.log('获取当前观众订阅状态成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前观众订阅状态失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_getSubscriberSummary () {
    this.log('获取当前主播订阅概况')
    global.hyExt.context.getSubscriberSummary().then(resp => {
      this.log('获取当前主播订阅概况成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前主播订阅概况失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_onSubscriberChange () {
    let args = []
    args[0] = {}
    args[0].userNick = this.state.hyExt_context_onSubscriberChange_0_userNick || ""
    args[1] = this.commonLog
    this.log('监听当前主播订阅变化消息：' + JSON.stringify(args))
    global.hyExt.context.onSubscriberChange(args[0], args[1]).then(() => {
      this.log('监听当前主播订阅变化消息成功')
    }).catch(err => {
      this.log('监听当前主播订阅变化消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_offSubscriberChange () {
    this.log('取消监听当前主播订阅变化消息')
    global.hyExt.context.offSubscriberChange().then(() => {
      this.log('取消监听当前主播订阅变化消息成功')
    }).catch(err => {
      this.log('取消监听当前主播订阅变化消息失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.context.leadSubscribe</Text>
        <SubmitButton onPress={this.submit_hyExt_context_leadSubscribe.bind(this)}>引导当前观众订阅当前主播</SubmitButton>
        <Text style={styles.header}>hyExt.context.getSubscribeInfo</Text>
        <SubmitButton onPress={this.submit_hyExt_context_getSubscribeInfo.bind(this)}>获取当前观众订阅状态</SubmitButton>
        <Text style={styles.header}>hyExt.context.getSubscriberSummary</Text>
        <SubmitButton onPress={this.submit_hyExt_context_getSubscriberSummary.bind(this)}>获取当前主播订阅概况</SubmitButton>
        <Text style={styles.header}>hyExt.context.onSubscriberChange</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='userNick'>
            <Input placeholder='请输入用户昵称'
              value={this.state.hyExt_context_onSubscriberChange_0_userNick || ''}
              onChange={v => this.setState({ hyExt_context_onSubscriberChange_0_userNick: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_context_onSubscriberChange.bind(this)}>监听当前主播订阅变化消息</SubmitButton>
        <Text style={styles.header}>hyExt.context.offSubscriberChange</Text>
        <SubmitButton onPress={this.submit_hyExt_context_offSubscriberChange.bind(this)}>取消监听当前主播订阅变化消息</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}