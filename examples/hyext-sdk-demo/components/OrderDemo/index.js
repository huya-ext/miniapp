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
  submit_hyExt_order_reportText () {
    let args = []
    args[0] = {}
    args[0].text = this.state.hyExt_order_reportText_0_text || ""
    this.log('发起小程序文本的秩序审核：' + JSON.stringify(args))
    global.hyExt.order.reportText(args[0]).then(() => {
      this.log('发起小程序文本的秩序审核成功')
    }).catch(err => {
      this.log('发起小程序文本的秩序审核失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.order.reportText</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='text'>
            <Input placeholder='请输入要检查的字符串'
              value={this.state.hyExt_order_reportText_0_text || ''}
              onChange={v => this.setState({ hyExt_order_reportText_0_text: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_order_reportText.bind(this)}>发起小程序文本的秩序审核</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}