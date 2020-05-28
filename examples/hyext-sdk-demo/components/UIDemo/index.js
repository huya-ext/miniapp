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
  submit_hyExt_context_showActivityBadge () {
    this.log('显示互动通道入口红点')
    global.hyExt.context.showActivityBadge().then(() => {
      this.log('显示互动通道入口红点成功')
    }).catch(err => {
      this.log('显示互动通道入口红点失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_context_showToast () {
    let args = []
    args[0] = this.state.hyExt_context_showToast_0 || ""
    this.log('显示直播间Toast：' + JSON.stringify(args))
    global.hyExt.context.showToast(args[0]).then(() => {
      this.log('显示直播间Toast成功')
    }).catch(err => {
      this.log('显示直播间Toast失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.context.showActivityBadge</Text>
        <SubmitButton onPress={this.submit_hyExt_context_showActivityBadge.bind(this)}>显示互动通道入口红点</SubmitButton>
        <Text style={styles.header}>hyExt.context.showToast</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='Toast内容'>
            <Input placeholder='请输入Toast内容'
              value={this.state.hyExt_context_showToast_0 || ''}
              onChange={v => this.setState({ hyExt_context_showToast_0: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_context_showToast.bind(this)}>显示直播间Toast</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}