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
  submit_hyExt_backend_commonQuery () {
    let args = []
    args[0] = {}
    args[0].key = this.state.hyExt_backend_commonQuery_0_key || "getServerTime"
    args[0].param = {}
    try {
      args[0].param = JSON.parse(this.state.hyExt_backend_commonQuery_0_param)
    } catch (_) {}
    this.log('通用查询接口：' + JSON.stringify(args))
    global.hyExt.backend.commonQuery(args[0]).then(resp => {
      this.log('通用查询接口成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('通用查询接口失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.backend.commonQuery</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='key'>
            <Input placeholder='请输入关键字'
              value={this.state.hyExt_backend_commonQuery_0_key || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_backend_commonQuery_0_key: v })} />
          </FormItem>
          <FormItem label='param'>
            <Input placeholder='请输入参数'
              value={this.state.hyExt_backend_commonQuery_0_param || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_backend_commonQuery_0_param: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_backend_commonQuery.bind(this)}>通用查询接口</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}