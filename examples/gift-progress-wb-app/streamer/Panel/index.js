import React, { Component } from 'react'
import { UI } from '@hyext/hy-ui'
import './style.hycss'
import styles from '../../common/styles'
import { SetGift } from '../../comps/SetGift/index';

const { View, Button, Tip, Text, Input, ScrollView } = UI

export default class Panel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      wbData: '',   // 发送到独立白板的数据，驱动独立白板进行视图更新
      log: '',      // 白板布局变化后的回调信息
      giftInfo: [], // 发送独立白板的礼物数据
    }
  }

  componentDidMount () {
    this.getGiftInfo();
    this.onGiftChange();
  }

  // 获取直播间礼物信息
  getGiftInfo(){
    hyExt.context.getGiftConf().then(giftInfo => {
      console.log(4444, giftInfo);
      if(giftInfo){
        // NOTE: 这里我们因为只做示范仅截取直播间礼物前4位
        this.setState({
          giftInfo: giftInfo.map((item,i) => {
            // 设置礼物初始目标值和当前值
            return Object.assign({}, item, { target: 1, now: 0 })
          }).slice(0, 4)
        })
      }
    })
  }

  onPress = () => {
    // 获取当前推流的分辨率 根据返回获取 宽高信息
    global.hyExt.stream.getStreamResolution().then(resolution => {
      Tip.show('resolution：' + JSON.stringify(resolution), 2000, 'center')
      const { width, height } = resolution
      // 创建白板
      return global.hyExt.stream.createWB({
        type: 'EXTRA', // 白板类型 EXTRA=独立白板
        wbName: 'foo', // 业务传入的白板标识
        offsetX: 0,    // 相对推流出去的界面左侧的偏移量（单位是像素）
        offsetY: 0,    // 相对推流出去的界面顶部的偏移量（单位是像素）
        canvasWidth: width / 2,   // 推流出去的界面里白板图层占的宽度（单位是像素）
        canvasHeight: height / 2, // 推流出去的界面里白板图层占的高度（单位是像素）
        x: 0, // 白板左侧偏移量（单位是像素）
        y: 0, // 白板顶部偏移量（单位是像素）
        width: width,   // 白板区域宽度（单位是像素）
        height: height, // 白板高度（单位是像素）
        force: true,    // 忽略记忆参数，强制使用当前配置
      })
    }).then(({ wbId }) => {
      setTimeout(() => Tip.show('wbId：' + wbId, 2000, 'center'), 3000)

      // 	监听白板布局变化消息
      global.hyExt.stream.onWBLayoutChange({
        wbId,
        wbName: 'foo',
        callback: layoutInfo => this.setState({ log: JSON.stringify(layoutInfo) })
      })

      this._wbId = wbId
    }).catch(err => {
      setTimeout(() => Tip.show('err：' + err.message, 2000, 'center'), 3000)
    })
  }

  // 删除白板
  onPressRemove = () => {
    if (this._wbId) {
      global.hyExt.stream.deleteWB({
        wbId: this._wbId
      }).then(() => {
        Tip.show('删除独立白板成功', 2000, 'center')
        this._wbId = null
      }, err => {
        Tip.show('删除独立白板失败：' + err.message, 2000, 'center')
      })
    } else {
      Tip.show('还没创建独立白板呢亲', 2000, 'center')
    }
  }

  // 发送消息到小程序独立白板
  sendToExtraWhiteBoard = () => {
    const { wbData, giftInfo } = this.state;
    const req = JSON.stringify({ title: wbData, giftConf: giftInfo });

    if (this._wbId) {
      global.hyExt.stream.sendToExtraWhiteBoard({
        wbId: this._wbId,
        data: req
      }).then(() => {
        Tip.show('发送成功', 200, 'center')
      }, err => {
        Tip.show('发送失败：' + err.message, 200, 'center')
      })
    } else {
      Tip.show('还没创建独立白板呢亲', 2000, 'center')
    }
  }

  showGiftChange(data){
    console.log('监听礼物：', data);
    const { itemId, itemName, sendNick, sendItemCount } = data;

    this.setState((state) => {
      return {
        giftInfo: (state.giftInfo || []).map((giftItem, index) => {
          if (giftItem.giftId === itemId) return Object.assign({}, giftItem, { now: (sendItemCount + giftItem.now) });
          return giftItem;
        }),
      }
    }, () => {
      console.log('监听礼物 after setState：', this.state)
      this.sendToExtraWhiteBoard()
    })
  }

  // 监听礼物变化
  onGiftChange(){
    let func = this.showGiftChange.bind(this);
    console.log("执行onGiftChange");
    hyExt.context.onGiftChange({}, func).then(() => {
      console.log('监听当前直播间礼物变化消息成功')
    }).catch(err => {
      console.log('监听当前直播间礼物变化消息失败，错误信息：' + err.message)
    })
  }

  // 处理礼物数目 target
  handleChange = (params) => {
    this.setState((state) => {
      return {
        giftInfo: (state.giftInfo || []).map((giftItem, index) => {
          if (giftItem.giftId === params.giftId) return Object.assign({}, giftItem, { target: params.value });
          return giftItem;
        }),
      }
    })
  }


  render () {
    const { log, giftInfo } = this.state;

    return (
      <View className='container'>
        <SetGift giftInfo={giftInfo} handleChange={this.handleChange}/>

        <View className="wrapper">
          <Button style={styles.btnStyls} type="success" size='sm' onPress={this.onPress}>添加独立白板</Button>
          <Button style={styles.btnStyls} type="warning" size='sm' onPress={this.onPressRemove}>移除独立白板</Button>
        </View>

        <View className="wrapper">
          <Input className='input' blurOnSubmit={false} placeholder='输入发送消息' value={this.state.wbData} onChange={v => this.setState({ wbData: v })} />
          <Button style={styles.btnStyls} type="info" size='sm' onPress={this.sendToExtraWhiteBoard}>发送独立白板</Button>
        </View>

        <View className="log-msg">
          <ScrollView contentContainerStyle={styles.scroller}>
          <Text className='log'>{log || ''}</Text>
          </ScrollView>
        </View>
      </View>
    )
  }
}
