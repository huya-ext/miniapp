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
  submit_hyExt_request () {
    let args = []
    args[0] = {}
    args[0].header = {}
    try {
      args[0].header = JSON.parse(this.state.hyExt_request_0_header)
    } catch (_) {}
    args[0].url = this.state.hyExt_request_0_url || ""
    args[0].method = this.state.hyExt_request_0_method || "GET"
    args[0].data = {}
    try {
      args[0].data = JSON.parse(this.state.hyExt_request_0_data)
    } catch (_) {}
    args[0].dataType = this.state.hyExt_request_0_dataType || "json"
    this.log('发送HTTP请求：' + JSON.stringify(args))
    global.hyExt.request(args[0]).then(resp => {
      this.log('发送HTTP请求成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('发送HTTP请求失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.request</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='header'>
            <Input placeholder='请输入自定义的HTTP头，可选'
              value={this.state.hyExt_request_0_header || ''}
              onChange={v => this.setState({ hyExt_request_0_header: v })} />
          </FormItem>
          <FormItem label='url'>
            <Input placeholder='请输入请求地址'
              value={this.state.hyExt_request_0_url || ''}
              onChange={v => this.setState({ hyExt_request_0_url: v })} />
          </FormItem>
          <FormItem label='method'>
            <Select data={[{"label":"GET","value":"GET"},{"label":"POST","value":"POST"}]}
              header='HTTP方法'
              value={this.state.hyExt_request_0_method || "GET"}
              onPressConfirm={v => this.setState({ hyExt_request_0_method: v.value })} />
          </FormItem>
          <FormItem label='data'>
            <Input placeholder='请输入请求的Body'
              value={this.state.hyExt_request_0_data || ''}
              onChange={v => this.setState({ hyExt_request_0_data: v })} />
          </FormItem>
          <FormItem label='dataType'>
            <Select data={[{"label":"json","value":"json"},{"label":"text","value":"text"}]}
              header='返回的数据格式'
              value={this.state.hyExt_request_0_dataType || "json"}
              onPressConfirm={v => this.setState({ hyExt_request_0_dataType: v.value })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_request.bind(this)}>发送HTTP请求</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}