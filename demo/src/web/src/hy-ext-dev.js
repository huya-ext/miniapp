import React from 'react'
import {
  Collapse,
  List,
  Button
} from 'antd'

import RequestEbsForm from './components/request-ebs-form'
import MessageForm from './components/message-form'
import SubscribeForm from './components/subscribe-form'
import GiftForm from './components/gift-form'
import BarrageForm from './components/barrage-form'
import StorageForm from './components/storage-form'
import CommonUIForm from './components/common-ui-form'

const { Panel } = Collapse
const { Item } = List

const renderItem = ({ msg, time }) => (
  <Item style={{ wordBreak: 'break-all' }}>[{time.toLocaleTimeString()}]{msg}</Item>
)

class HyExtDev extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}

    for (let i = 1; i <= 11; i++) {
      (i => {
        this.state['log' + i] = [{
          msg: '开始记录日志',
          time: new Date()
        }]
        this['log' + i] = msg => {
          let s = {}
          s['log' + i] = [
            ...this.state['log' + i].slice(Math.max(0, this.state['log' + i].length - 4)), {
              msg,
              time: new Date()
            }
          ]
          this.setState(s)

          window.hyExt.logger.info(msg)
        }
      })(i)
    }
  }
  componentDidMount () {
    this.log1('PlayGround Ready, 等待SDK onLoad...')
    window.hyExt.onLoad(() => {
      this.log1('虎牙小程序SDK onLoad触发')

      window.hyExt.onEnterForeground(() => {
        this.log1('进入前台')
      })
      window.hyExt.onLeaveForeground(() => {
        this.log1('退出前台')
      })
    })
  }
  render () {
    return (
      <div>
        <h1 style={{ margin: 0, lineHeight: 3, textAlign: 'center' }}>虎牙小程序PlayGround</h1>
        <Collapse defaultActiveKey={['0']}>
          <Panel header='全局日志'>
            <List bordered dataSource={this.state.log1} renderItem={renderItem} />
          </Panel>
          <Panel header='调用EBS接口'>
            <RequestEbsForm requestEbs={this.requestEbs.bind(this)} />
            <List bordered dataSource={this.state.log2} renderItem={renderItem} header={<div>日志</div>} />
          </Panel>
          <Panel header='消息监听'>
            <MessageForm
              onMessage={this.onMessage.bind(this)}
              emitMessage={this.emitMessage.bind(this)}
            />
            <List bordered dataSource={this.state.log3} renderItem={renderItem} header={<div>日志</div>} />
          </Panel>
          <Panel header='订阅相关'>
            <SubscribeForm
              leadSubscribe={this.leadSubscribe.bind(this)}
              getSubscribeInfo={this.getSubscribeInfo.bind(this)}
              getSubscriberSummary={this.getSubscriberSummary.bind(this)}
              onSubscribeSubmit={this.onSubscribeSubmit.bind(this)}
              onSubscriberChange={this.onSubscriberChange.bind(this)}
              offSubscriberChange={this.offSubscriberChange.bind(this)}
            />
            <List bordered dataSource={this.state.log4} renderItem={renderItem} header={<div>日志</div>} />
          </Panel>
          <Panel header='礼物相关'>
            <GiftForm
              leadGift={this.leadGift.bind(this)}
              onGiftChange={this.onGiftChange.bind(this)}
              onGiftSubmit={this.onGiftSubmit.bind(this)}
              offGiftChange={this.offGiftChange.bind(this)}
            />
            <List bordered dataSource={this.state.log5} renderItem={renderItem} header={<div>日志</div>} />
          </Panel>
          <Panel header='弹幕相关'>
            <BarrageForm
              leadBarrage={this.leadBarrage.bind(this)}
              onBarrageChange={this.onBarrageChange.bind(this)}
              onBarrageSubmit={this.onBarrageSubmit.bind(this)}
              offBarrageChange={this.offBarrageChange.bind(this)}
            />
            <List bordered dataSource={this.state.log6} renderItem={renderItem} header={<div>日志</div>} />
          </Panel>
          <Panel header='存储相关'>
            <StorageForm
              getItem={this.getItem.bind(this)}
              setItem={this.setItem.bind(this)}
              getKeys={this.getKeys.bind(this)}
              removeItem={this.removeItem.bind(this)}
            />
            <List bordered dataSource={this.state.log7} renderItem={renderItem} header={<div>日志</div>} />
          </Panel>
          <Panel header='通用UI'>
            <CommonUIForm
              showActivityBadge={this.showActivityBadge.bind(this)}
              showToast={this.showToast.bind(this)}
            />
            <List bordered dataSource={this.state.log8} renderItem={renderItem} />
          </Panel>
          <Panel header='用户相关'>
            <div style={{ marginBottom: '16px' }}>
              <Button onClick={this.getUserInfo.bind(this)}>获取用户信息</Button>
            </div>
            <List bordered dataSource={this.state.log9} renderItem={renderItem} />
          </Panel>
          <Panel header='直播间相关'>
            <div style={{ marginBottom: '8px' }}>
              <Button style={{ marginBottom: '8px' }} block onClick={this.getLiveInfo.bind(this)}>获取直播间信息</Button>
              <Button style={{ marginBottom: '8px' }} block onClick={this.getWeekRank.bind(this)}>获取周贡榜</Button>
              <Button style={{ marginBottom: '8px' }} block onClick={this.getFansRank.bind(this)}>获取粉丝榜</Button>
              <Button style={{ marginBottom: '8px' }} block onClick={this.getVip.bind(this)}>获取贵宾</Button>
            </div>
            <List bordered dataSource={this.state.log10} renderItem={renderItem} />
          </Panel>
          <Panel header='流相关'>
            <div id='foo' style={{ marginBottom: '8px', background: 'red', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              捕捉这里
            </div>
            <Button style={{ marginBottom: '8px' }} block onClick={this.addZone.bind(this)}>增加捕捉区域</Button>
            <Button style={{ marginBottom: '8px' }} block onClick={this.removeZone.bind(this)}>删除区域</Button>
            <List bordered dataSource={this.state.log11} renderItem={renderItem} />
          </Panel>
        </Collapse>
      </div>
    )
  }
  requestEbs ({ host, port, path, httpMethod, param }) {
    this.log2('发送请求：' + JSON.stringify({ host, port, path, httpMethod, param }))
    window.hyExt.requestEbs({ host, port, path, httpMethod, param }).then(rsp => {
      this.log2('接收响应：' + JSON.stringify(rsp))
    }).catch(err => {
      this.log2('接收失败：' + err.message)
    })
  }
  onMessage ({ type, event }) {
    let typeName = type === 'observer' ? '扩展消息' : '宿主消息'
    this.log3('监听消息，类型：' + typeName + ', 事件名：' + event)
    window.hyExt[type].on(event, content => {
      this.log3('消息触发，消息类型：' + typeName + '，消息事件名：' + event + '，消息内容：' + (type === 'observer' ? content : JSON.stringify(content)))
    })
  }
  emitMessage ({ event, message }) {
    this.log3('发送消息，事件名：' + event + '，消息内容：' + message)
    window.hyExt.observer.emit(event, message).then(() => {
      this.log3('发送成功')
    }).catch(err => {
      this.log3('发送失败：' + err.message)
    })
  }
  leadSubscribe () {
    this.log4('调用引导订阅接口')
    window.hyExt.context.leadSubscribe().then(() => {
      this.log4('调用成功')
    }).catch(err => {
      this.log4('调用失败：' + err.message)
    })
  }
  getSubscribeInfo () {
    this.log4('获取当前观众的订阅状态')
    window.hyExt.context.getSubscribeInfo().then(isSubscribed => {
      this.log4('获取成功，当前订阅状态是：' + isSubscribed)
    }).catch(err => {
      this.log4('获取失败：' + err.message)
    })
  }
  getSubscriberSummary () {
    this.log4('获取当前主播的订阅者概况')
    window.hyExt.context.getSubscriberSummary().then(subscriberSummary => {
      this.log4('获取成功，当前订阅者概况是：' + JSON.stringify(subscriberSummary))
    }).catch(err => {
      this.log4('获取失败：' + err.message)
    })
  }
  onSubscribeSubmit () {
    this.log4('监听订阅变化消息')
    window.hyExt.context.on('subscribeSubmit', isSubscribed => {
      this.log4('订阅变化消息触发：' + isSubscribed)
    })
  }
  onSubscriberChange (options) {
    this.log4('监听订阅者变化消息，过滤条件为：' + JSON.stringify(options))
    window.hyExt.context.onSubscriberChange(options, subscriberInfo => {
      this.log4('订阅者变化消息触发，条件为：' + JSON.stringify(options) + '，消息内容：' + JSON.stringify(subscriberInfo))
    }).then(() => {
      this.log4('监听成功')
    }).catch(err => {
      this.log4('监听失败：' + err.message)
    })
  }
  offSubscriberChange () {
    this.log4('取消监听')
    window.hyExt.context.offSubscriberChange().then(() => {
      this.log4('取消成功')
    }).catch(err => {
      this.log4('取消失败：' + err.message)
    })
  }
  leadGift () {
    this.log5('调用引导送礼接口')
    window.hyExt.context.leadGift().then(() => {
      this.log5('调用成功')
    }).catch(err => {
      this.log5('调用失败：' + err.message)
    })
  }
  onGiftChange (options) {
    this.log5('监听送礼消息，过滤条件为：' + JSON.stringify(options))
    window.hyExt.context.onGiftChange(options, giftInfo => {
      this.log5('送礼消息触发，条件为：' + JSON.stringify(options) + '，消息内容：' + JSON.stringify(giftInfo))
    }).then(() => {
      this.log5('监听成功')
    }).catch(err => {
      this.log5('监听失败：' + err.message)
    })
  }
  offGiftChange () {
    this.log5('取消监听')
    window.hyExt.context.offGiftChange().then(() => {
      this.log5('取消成功')
    }).catch(err => {
      this.log5('取消失败：' + err.message)
    })
  }
  onGiftSubmit () {
    this.log5('监听当前观众的送礼消息')
    window.hyExt.context.on('giftSubmit', giftInfo => {
      this.log5('当前观众送礼：' + JSON.stringify(giftInfo))
    })
  }
  leadBarrage () {
    this.log6('调用引导发言接口')
    window.hyExt.context.leadBarrage().then(() => {
      this.log6('调用成功')
    }).catch(err => {
      this.log6('调用失败：' + err.message)
    })
  }
  onBarrageChange (options) {
    this.log6('监听发言消息，过滤条件为：' + JSON.stringify(options))
    window.hyExt.context.onBarrageChange(options, barrageInfo => {
      this.log6('发言消息触发，条件为：' + JSON.stringify(options) + '，消息内容：' + JSON.stringify(barrageInfo))
    }).then(() => {
      this.log6('监听成功')
    }).catch(err => {
      this.log6('监听失败：' + err.message)
    })
  }
  offBarrageChange () {
    this.log6('取消监听')
    window.hyExt.context.offBarrageChange().then(() => {
      this.log6('取消成功')
    }).catch(err => {
      this.log6('取消失败：' + err.message)
    })
  }
  onBarrageSubmit () {
    this.log6('监听提供当前用户的发言消息')
    window.hyExt.context.on('barrageSubmit', barrageInfo => {
      this.log6('当前用户发言：' + JSON.stringify(barrageInfo))
    })
  }
  getItem (key) {
    this.log7('获取值，key：' + key)
    window.hyExt.storage.getItem(key).then(value => {
      this.log7('获取成功，key：' + key + '，value：' + value)
    }).catch(err => {
      this.log7('获取失败，key：' + key + '，err：' + err.message)
    })
  }
  setItem (key, value) {
    this.log7('设置值，key：' + key + '，value：' + value)
    window.hyExt.storage.setItem(key, value).then(() => {
      this.log7('设置成功，key：' + key + '，value：' + value)
    }).catch(err => {
      this.log7('设置失败，key：' + key + '，value：' + value + '，err：' + err.message)
    })
  }
  getKeys () {
    this.log7('获取所有键')
    window.hyExt.storage.getKeys().then(keys => {
      this.log7('获取所有键成功，keys：' + JSON.stringify(keys))
    }).catch(err => {
      this.log7('获取所有键失败，err：' + err.message)
    })
  }
  removeItem (key) {
    this.log7('删除值，key：' + key)
    window.hyExt.storage.removeItem(key).then(() => {
      this.log7('删除成功，key：' + key)
    }).catch(err => {
      this.log7('删除失败，key：' + key + '，err：' + err.message)
    })
  }
  showActivityBadge () {
    this.log8('显示互动通道红点')
    window.hyExt.context.showActivityBadge().then(() => {
      this.log8('显示互动通道红点成功')
    }).catch(err => {
      this.log8('显示互动通道红点失败，err：' + err.message)
    })
  }
  showToast (msg) {
    this.log8('显示Toast')
    window.hyExt.context.showToast(msg).then(() => {
      this.log8('显示Toast成功')
    }).catch(err => {
      this.log8('显示Toast失败，err：' + err.message)
    })
  }
  getUserInfo () {
    this.log9('获取用户信息')
    window.hyExt.context.getUserInfo().then(userInfo => {
      this.log9('获取成功：' + JSON.stringify(userInfo))
    }).catch(err => {
      this.log9('获取失败：' + err.message)
    })
  }
  getLiveInfo () {
    this.log10('获取直播间信息')
    window.hyExt.context.getLiveInfo().then(liveInfo => {
      this.log10('获取成功：' + JSON.stringify(liveInfo))
    }).catch(err => {
      this.log10('获取失败：' + err.message)
    })
  }
  getWeekRank () {
    this.log10('获取周贡榜信息')
    window.hyExt.context.getWeekRank().then(weekRank => {
      this.log10('获取成功：' + JSON.stringify(weekRank))
    }).catch(err => {
      this.log10('获取失败：' + err.message)
    })
  }
  getFansRank () {
    this.log10('获取粉丝榜信息')
    window.hyExt.context.getFansRank().then(fansRank => {
      this.log10('获取成功：' + JSON.stringify(fansRank))
    }).catch(err => {
      this.log10('获取失败：' + err.message)
    })
  }
  getVip () {
    this.log10('获取贵宾信息')
    window.hyExt.context.getVip().then(vipInfo => {
      this.log10('获取成功：' + JSON.stringify(vipInfo))
    }).catch(err => {
      this.log10('获取失败：' + err.message)
    })
  }
  addZone (el) {
    this.log11('增加捕捉区域')
    window.hyExt.stream.addZone(document.getElementById('foo')).then(() => {
      this.log11('操作成功')
    }).catch(err => {
      this.log11('操作失败：' + err.message)
    })
  }
  removeZone () {
    this.log11('删除捕捉区域')
    window.hyExt.stream.removeZone().then(() => {
      this.log11('操作成功')
    }).catch(err => {
      this.log11('操作失败：' + err.message)
    })
  }
}

export default HyExtDev
