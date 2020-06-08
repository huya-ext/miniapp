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
  submit_hyExt_storage_getItem () {
    let args = []
    args[0] = this.state.hyExt_storage_getItem_0 || ""
    this.log('获取小程序简易存储键值对：' + JSON.stringify(args))
    global.hyExt.storage.getItem(args[0]).then(resp => {
      this.log('获取小程序简易存储键值对成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取小程序简易存储键值对失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_storage_setItem () {
    let args = []
    args[0] = this.state.hyExt_storage_setItem_0 || ""
    args[1] = this.state.hyExt_storage_setItem_1 || ""
    this.log('设置小程序简易存储键值对：' + JSON.stringify(args))
    global.hyExt.storage.setItem(args[0], args[1]).then(() => {
      this.log('设置小程序简易存储键值对成功')
    }).catch(err => {
      this.log('设置小程序简易存储键值对失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_storage_getKeys () {
    this.log('获取小程序简易存储的键集合')
    global.hyExt.storage.getKeys().then(resp => {
      this.log('获取小程序简易存储的键集合成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('获取小程序简易存储的键集合失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_storage_removeItem () {
    let args = []
    args[0] = this.state.hyExt_storage_removeItem_0 || ""
    this.log('移除小程序简易存储键值对：' + JSON.stringify(args))
    global.hyExt.storage.removeItem(args[0]).then(() => {
      this.log('移除小程序简易存储键值对成功')
    }).catch(err => {
      this.log('移除小程序简易存储键值对失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.storage.getItem</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='键'>
            <Input placeholder='请输入键'
              value={this.state.hyExt_storage_getItem_0 || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_storage_getItem_0: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_storage_getItem.bind(this)}>获取小程序简易存储键值对</SubmitButton>
        <Text style={styles.header}>hyExt.storage.setItem</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='键'>
            <Input placeholder='请输入键'
              value={this.state.hyExt_storage_setItem_0 || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_storage_setItem_0: v })} />
          </FormItem>
          <FormItem label='值'>
            <Input placeholder='请输入值'
              value={this.state.hyExt_storage_setItem_1 || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_storage_setItem_1: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_storage_setItem.bind(this)}>设置小程序简易存储键值对</SubmitButton>
        <Text style={styles.header}>hyExt.storage.getKeys</Text>
        <SubmitButton onPress={this.submit_hyExt_storage_getKeys.bind(this)}>获取小程序简易存储的键集合</SubmitButton>
        <Text style={styles.header}>hyExt.storage.removeItem</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='键'>
            <Input placeholder='请输入键'
              value={this.state.hyExt_storage_removeItem_0 || ''}
              inputStyle={{ color: '#000' }}
              onChange={v => this.setState({ hyExt_storage_removeItem_0: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_storage_removeItem.bind(this)}>移除小程序简易存储键值对</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}