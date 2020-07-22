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
  submit_hyExt_context_onLayoutChange () {
    let args = []
    args[0] = this.commonLog
    this.log('监听当前直播间小程序容器布局变化消息')
    global.hyExt.context.onLayoutChange(args[0]).then(() => {
      this.log('监听当前直播间小程序容器布局变化消息成功')
    }).catch(err => {
      this.log('监听当前直播间小程序容器布局变化消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_panel_setLayout () {
    let args = []
    args[0] = {}
    args[0].visible = !!this.state.hyExt_panel_setLayout_0_visible
    args[0].x = Number(this.state.hyExt_panel_setLayout_0_x) || 0
    args[0].y = Number(this.state.hyExt_panel_setLayout_0_y) || 0
    args[0].width = Number(this.state.hyExt_panel_setLayout_0_width) || 0
    args[0].height = Number(this.state.hyExt_panel_setLayout_0_height) || 0
    args[0].animate = !!this.state.hyExt_panel_setLayout_0_animate
    args[0].duration = Number(this.state.hyExt_panel_setLayout_0_duration) || 0
    args[0].alpha = Number(this.state.hyExt_panel_setLayout_0_alpha) || 0
    this.log('设置小程序布局：' + JSON.stringify(args))
    global.hyExt.panel.setLayout(args[0]).then(() => {
      this.log('设置小程序布局成功')
    }).catch(err => {
      this.log('设置小程序布局失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.context.onLayoutChange</Text>
        <SubmitButton onPress={this.submit_hyExt_context_onLayoutChange.bind(this)}>监听当前直播间小程序容器布局变化消息</SubmitButton>
        <Text style={styles.header}>hyExt.panel.setLayout</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='visible'>
            <Switch value={this.state.hyExt_panel_setLayout_0_visible || false}
              onChange={v => this.setState({ hyExt_panel_setLayout_0_visible: v })} />
          </FormItem>
          <FormItem label='x'>
            <Input placeholder='请输入左上角横坐标占容器的比例'
              value={this.state.hyExt_panel_setLayout_0_x || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_panel_setLayout_0_x: v })} />
          </FormItem>
          <FormItem label='y'>
            <Input placeholder='请输入左上角纵坐标占容器的比例'
              value={this.state.hyExt_panel_setLayout_0_y || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_panel_setLayout_0_y: v })} />
          </FormItem>
          <FormItem label='width'>
            <Input placeholder='请输入宽度占容器的比例'
              value={this.state.hyExt_panel_setLayout_0_width || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_panel_setLayout_0_width: v })} />
          </FormItem>
          <FormItem label='height'>
            <Input placeholder='请输入高度占容器的比例'
              value={this.state.hyExt_panel_setLayout_0_height || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_panel_setLayout_0_height: v })} />
          </FormItem>
          <FormItem label='animate'>
            <Switch value={this.state.hyExt_panel_setLayout_0_animate || false}
              onChange={v => this.setState({ hyExt_panel_setLayout_0_animate: v })} />
          </FormItem>
          <FormItem label='duration'>
            <Input placeholder='请输入动画时长（毫秒）'
              value={this.state.hyExt_panel_setLayout_0_duration || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_panel_setLayout_0_duration: v })} />
          </FormItem>
          <FormItem label='alpha'>
            <Input placeholder='请输入不透明度'
              value={this.state.hyExt_panel_setLayout_0_alpha || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_panel_setLayout_0_alpha: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_panel_setLayout.bind(this)}>设置小程序布局</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}