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
  submit_hyExt_context_leadGift () {
    this.log('引导当前观众送礼')
    global.hyExt.context.leadGift().then(() => {
      this.log('引导当前观众送礼成功')
    }).catch(err => {
      this.log('引导当前观众送礼失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_onGiftChange () {
    let args = []
    args[0] = {}
    args[0].sendNick = this.state.hyExt_context_onGiftChange_0_sendNick || ""
    args[0].itemName = this.state.hyExt_context_onGiftChange_0_itemName || ""
    args[0].minSendItemCount = Number(this.state.hyExt_context_onGiftChange_0_minSendItemCount) || 0
    args[0].minSendItemComboHits = Number(this.state.hyExt_context_onGiftChange_0_minSendItemComboHits) || 0
    args[1] = this.commonLog
    this.log('监听当前直播间礼物变化消息：' + JSON.stringify(args))
    global.hyExt.context.onGiftChange(args[0], args[1]).then(() => {
      this.log('监听当前直播间礼物变化消息成功')
    }).catch(err => {
      this.log('监听当前直播间礼物变化消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_offGiftChange () {
    this.log('取消监听当前直播间礼物变化消息')
    global.hyExt.context.offGiftChange().then(() => {
      this.log('取消监听当前直播间礼物变化消息成功')
    }).catch(err => {
      this.log('取消监听当前直播间礼物变化消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_getGiftConf () {
    this.log('获取当前直播间礼物配置')
    global.hyExt.context.getGiftConf().then(resp => {
      this.log('获取当前直播间礼物配置成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取当前直播间礼物配置失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_sendGift () {
    let args = []
    args[0] = {}
    args[0].giftId = Number(this.state.hyExt_context_sendGift_0_giftId) || 0
    args[0].giftCount = Number(this.state.hyExt_context_sendGift_0_giftCount) || 0
    this.log('当前观众送礼：' + JSON.stringify(args))
    global.hyExt.context.sendGift(args[0]).then(() => {
      this.log('当前观众送礼成功')
    }).catch(err => {
      this.log('当前观众送礼失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.context.leadGift</Text>
        <SubmitButton onPress={this.submit_hyExt_context_leadGift.bind(this)}>引导当前观众送礼</SubmitButton>
        <Text style={styles.header}>hyExt.context.onGiftChange</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='sendNick'>
            <Input placeholder='请输入用户昵称'
              value={this.state.hyExt_context_onGiftChange_0_sendNick || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_onGiftChange_0_sendNick: v })} />
          </FormItem>
          <FormItem label='itemName'>
            <Input placeholder='请输入礼物名称'
              value={this.state.hyExt_context_onGiftChange_0_itemName || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_onGiftChange_0_itemName: v })} />
          </FormItem>
          <FormItem label='minSendItemCount'>
            <Input placeholder='请输入最小礼物个数'
              value={this.state.hyExt_context_onGiftChange_0_minSendItemCount || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_onGiftChange_0_minSendItemCount: v })} />
          </FormItem>
          <FormItem label='minSendItemComboHits'>
            <Input placeholder='请输入最小连击次数'
              value={this.state.hyExt_context_onGiftChange_0_minSendItemComboHits || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_onGiftChange_0_minSendItemComboHits: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_context_onGiftChange.bind(this)}>监听当前直播间礼物变化消息</SubmitButton>
        <Text style={styles.header}>hyExt.context.offGiftChange</Text>
        <SubmitButton onPress={this.submit_hyExt_context_offGiftChange.bind(this)}>取消监听当前直播间礼物变化消息</SubmitButton>
        <Text style={styles.header}>hyExt.context.getGiftConf</Text>
        <SubmitButton onPress={this.submit_hyExt_context_getGiftConf.bind(this)}>获取当前直播间礼物配置</SubmitButton>
        <Text style={styles.header}>hyExt.context.sendGift</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='giftId'>
            <Input placeholder='请输入礼物Id'
              value={this.state.hyExt_context_sendGift_0_giftId || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_sendGift_0_giftId: v })} />
          </FormItem>
          <FormItem label='giftCount'>
            <Input placeholder='请输入礼物个数'
              value={this.state.hyExt_context_sendGift_0_giftCount || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_context_sendGift_0_giftCount: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_context_sendGift.bind(this)}>当前观众送礼</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}