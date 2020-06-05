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
  submit_hyExt_pc_downloadRes () {
    let args = []
    args[0] = {}
    args[0].url = this.state.hyExt_pc_downloadRes_0_url || ""
    args[0].md5 = this.state.hyExt_pc_downloadRes_0_md5 || ""
    args[0].unzip = !!this.state.hyExt_pc_downloadRes_0_unzip
    this.log('下载资源：' + JSON.stringify(args))
    global.hyExt.pc.downloadRes(args[0]).then(() => {
      this.log('下载资源成功')
    }).catch(err => {
      this.log('下载资源失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_pc_launchExe () {
    let args = []
    args[0] = {}
    args[0].md5 = this.state.hyExt_pc_launchExe_0_md5 || ""
    args[0].name = this.state.hyExt_pc_launchExe_0_name || ""
    args[0].params = {}
    try {
      args[0].params = JSON.parse(this.state.hyExt_pc_launchExe_0_params)
    } catch (_) {}
    this.log('启动外部EXE：' + JSON.stringify(args))
    global.hyExt.pc.launchExe(args[0]).then(() => {
      this.log('启动外部EXE成功')
    }).catch(err => {
      this.log('启动外部EXE失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_pc_onExeMessage () {
    let args = []
    args[0] = {}
    args[0].md5 = this.state.hyExt_pc_onExeMessage_0_md5 || ""
    args[0].callback = this.commonLog
    this.log('监听小程序外部EXE消息：' + JSON.stringify(args))
    global.hyExt.pc.onExeMessage(args[0]).then(() => {
      this.log('监听小程序外部EXE消息成功')
    }).catch(err => {
      this.log('监听小程序外部EXE消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_pc_onExeStateChange () {
    let args = []
    args[0] = {}
    args[0].md5 = this.state.hyExt_pc_onExeStateChange_0_md5 || ""
    args[0].callback = this.commonLog
    this.log('监听小程序外部EXE状态变化消息：' + JSON.stringify(args))
    global.hyExt.pc.onExeStateChange(args[0]).then(() => {
      this.log('监听小程序外部EXE状态变化消息成功')
    }).catch(err => {
      this.log('监听小程序外部EXE状态变化消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_pc_sendToExe () {
    let args = []
    args[0] = {}
    args[0].md5 = this.state.hyExt_pc_sendToExe_0_md5 || ""
    args[0].data = this.state.hyExt_pc_sendToExe_0_data || ""
    this.log('发送消息到小程序外部EXE：' + JSON.stringify(args))
    global.hyExt.pc.sendToExe(args[0]).then(() => {
      this.log('发送消息到小程序外部EXE成功')
    }).catch(err => {
      this.log('发送消息到小程序外部EXE失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.pc.downloadRes</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='url'>
            <Input placeholder='请输入要下载资源的url'
              value={this.state.hyExt_pc_downloadRes_0_url || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_pc_downloadRes_0_url: v })} />
          </FormItem>
          <FormItem label='md5'>
            <Input placeholder='请输入资源的md5'
              value={this.state.hyExt_pc_downloadRes_0_md5 || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_pc_downloadRes_0_md5: v })} />
          </FormItem>
          <FormItem label='unzip'>
            <Switch value={this.state.hyExt_pc_downloadRes_0_unzip || false}
              onChange={v => this.setState({ hyExt_pc_downloadRes_0_unzip: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_pc_downloadRes.bind(this)}>下载资源</SubmitButton>
        <Text style={styles.header}>hyExt.pc.launchExe</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='md5'>
            <Input placeholder='请输入exe的md5'
              value={this.state.hyExt_pc_launchExe_0_md5 || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_pc_launchExe_0_md5: v })} />
          </FormItem>
          <FormItem label='name'>
            <Input placeholder='请输入exe的名称'
              value={this.state.hyExt_pc_launchExe_0_name || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_pc_launchExe_0_name: v })} />
          </FormItem>
          <FormItem label='params'>
            <Input placeholder='请输入额外的参数'
              value={this.state.hyExt_pc_launchExe_0_params || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_pc_launchExe_0_params: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_pc_launchExe.bind(this)}>启动外部EXE</SubmitButton>
        <Text style={styles.header}>hyExt.pc.onExeMessage</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='md5'>
            <Input placeholder='请输入要监听消息exe的md5'
              value={this.state.hyExt_pc_onExeMessage_0_md5 || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_pc_onExeMessage_0_md5: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_pc_onExeMessage.bind(this)}>监听小程序外部EXE消息</SubmitButton>
        <Text style={styles.header}>hyExt.pc.onExeStateChange</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='md5'>
            <Input placeholder='请输入要监听消息exe的md5'
              value={this.state.hyExt_pc_onExeStateChange_0_md5 || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_pc_onExeStateChange_0_md5: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_pc_onExeStateChange.bind(this)}>监听小程序外部EXE状态变化消息</SubmitButton>
        <Text style={styles.header}>hyExt.pc.sendToExe</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='md5'>
            <Input placeholder='请输入要发送消息exe的md5'
              value={this.state.hyExt_pc_sendToExe_0_md5 || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_pc_sendToExe_0_md5: v })} />
          </FormItem>
          <FormItem label='data'>
            <Input placeholder='请输入要发送消息exe的数据'
              value={this.state.hyExt_pc_sendToExe_0_data || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_pc_sendToExe_0_data: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_pc_sendToExe.bind(this)}>发送消息到小程序外部EXE</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}