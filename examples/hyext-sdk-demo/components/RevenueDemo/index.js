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
  submit_hyExt_revenue_checkStreamerCanUseGoods () {
    let args = []
    args[0] = {}
    args[0].goodsUuid = this.state.hyExt_revenue_checkStreamerCanUseGoods_0_goodsUuid || ""
    this.log('判断当前主播是否可以使用指定的商品：' + JSON.stringify(args))
    global.hyExt.revenue.checkStreamerCanUseGoods(args[0]).then(resp => {
      this.log('判断当前主播是否可以使用指定的商品成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('判断当前主播是否可以使用指定的商品失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_revenue_startModuleGiftRevenueStat () {
    let args = []
    args[0] = {}
    args[0].goodsUuid = this.state.hyExt_revenue_startModuleGiftRevenueStat_0_goodsUuid || ""
    args[0].giftIds = this.state.hyExt_revenue_startModuleGiftRevenueStat_0_giftIds || ""
    this.log('开始统计：' + JSON.stringify(args))
    global.hyExt.revenue.startModuleGiftRevenueStat(args[0]).then(() => {
      this.log('开始统计成功')
    }).catch(err => {
      this.log('开始统计失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_revenue_endModuleGiftRevenueStat () {
    let args = []
    args[0] = {}
    args[0].goodsUuid = this.state.hyExt_revenue_endModuleGiftRevenueStat_0_goodsUuid || ""
    this.log('停止统计：' + JSON.stringify(args))
    global.hyExt.revenue.endModuleGiftRevenueStat(args[0]).then(() => {
      this.log('停止统计成功')
    }).catch(err => {
      this.log('停止统计失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_revenue_checkStreamerGoodsExpire () {
    let args = []
    args[0] = {}
    args[0].goodsUuid = this.state.hyExt_revenue_checkStreamerGoodsExpire_0_goodsUuid || ""
    this.log('判断当前主播指定的商品的使用有效期：' + JSON.stringify(args))
    global.hyExt.revenue.checkStreamerGoodsExpire(args[0]).then(resp => {
      this.log('判断当前主播指定的商品的使用有效期成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('判断当前主播指定的商品的使用有效期失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_revenue_popupGoodsBuyPanel () {
    let args = []
    args[0] = {}
    args[0].goodsUuid = this.state.hyExt_revenue_popupGoodsBuyPanel_0_goodsUuid || ""
    this.log('弹出商品购买的H5面板：' + JSON.stringify(args))
    global.hyExt.revenue.popupGoodsBuyPanel(args[0]).then(() => {
      this.log('弹出商品购买的H5面板成功')
    }).catch(err => {
      this.log('弹出商品购买的H5面板失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.revenue.checkStreamerCanUseGoods</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='goodsUuid'>
            <Input placeholder='请输入商品id'
              value={this.state.hyExt_revenue_checkStreamerCanUseGoods_0_goodsUuid || ''}
              onChange={v => this.setState({ hyExt_revenue_checkStreamerCanUseGoods_0_goodsUuid: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_revenue_checkStreamerCanUseGoods.bind(this)}>判断当前主播是否可以使用指定的商品</SubmitButton>
        <Text style={styles.header}>hyExt.revenue.startModuleGiftRevenueStat</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='goodsUuid'>
            <Input placeholder='请输入商品id'
              value={this.state.hyExt_revenue_startModuleGiftRevenueStat_0_goodsUuid || ''}
              onChange={v => this.setState({ hyExt_revenue_startModuleGiftRevenueStat_0_goodsUuid: v })} />
          </FormItem>
          <FormItem label='giftIds'>
            <Input placeholder='请输入礼物id，多个用竖线分隔'
              value={this.state.hyExt_revenue_startModuleGiftRevenueStat_0_giftIds || ''}
              onChange={v => this.setState({ hyExt_revenue_startModuleGiftRevenueStat_0_giftIds: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_revenue_startModuleGiftRevenueStat.bind(this)}>开始统计</SubmitButton>
        <Text style={styles.header}>hyExt.revenue.endModuleGiftRevenueStat</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='goodsUuid'>
            <Input placeholder='请输入商品id'
              value={this.state.hyExt_revenue_endModuleGiftRevenueStat_0_goodsUuid || ''}
              onChange={v => this.setState({ hyExt_revenue_endModuleGiftRevenueStat_0_goodsUuid: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_revenue_endModuleGiftRevenueStat.bind(this)}>停止统计</SubmitButton>
        <Text style={styles.header}>hyExt.revenue.checkStreamerGoodsExpire</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='goodsUuid'>
            <Input placeholder='请输入商品id'
              value={this.state.hyExt_revenue_checkStreamerGoodsExpire_0_goodsUuid || ''}
              onChange={v => this.setState({ hyExt_revenue_checkStreamerGoodsExpire_0_goodsUuid: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_revenue_checkStreamerGoodsExpire.bind(this)}>判断当前主播指定的商品的使用有效期</SubmitButton>
        <Text style={styles.header}>hyExt.revenue.popupGoodsBuyPanel</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='goodsUuid'>
            <Input placeholder='请输入商品id'
              value={this.state.hyExt_revenue_popupGoodsBuyPanel_0_goodsUuid || ''}
              onChange={v => this.setState({ hyExt_revenue_popupGoodsBuyPanel_0_goodsUuid: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_revenue_popupGoodsBuyPanel.bind(this)}>弹出商品购买的H5面板</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}