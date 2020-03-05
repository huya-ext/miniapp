import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './app.hycss'

const streamerSDK = global.hyExt

const { View, Text, Input, Button } = UI

class App extends Component {
  constructor () {
    super()

    this.state = {
      wb: false, // 代码是否处于独立白板模式
      wbData: '', // 发送到独立白板的数据，驱动独立白板进行视图更新
      wbMsg: '', // 独立白板接收到的数据，用来更新独立白板视图
      wbId: '' // 独立白板id
    }
    // 调用sdk获取初始化参数的api，判断是否处于独立白板模式
    if (typeof streamerSDK.env.getInitialParam === 'function') {
      streamerSDK.env.getInitialParam().then(param => {
        if (param.wb) {
          // 初始化参数包含wb参数，说明处于独立白板模式
          this.setState({
            wb: true
          })
          // 监听从原来小程序发送过来的独立白板数据
          streamerSDK.stream.onExtraWhiteBoardMessage({
            // 接收到数据，刷新视图
            callback: data => this.setState({ wbMsg: data })
          })
        }
      })
    }
  }
  sendToWb () {
    let { wbData, wbId } = this.state

    // 发送数据到独立白板
    streamerSDK.stream.sendToExtraWhiteBoard({
      wbId,
      data: wbData
    })
  }
  createWb () {
    let width = Number(this.state.width) || 300
    let height = Number(this.state.height) || 300

    // 创建独立白板
    streamerSDK.stream.addExtraWhiteBoard({
      width, height
    }).then(({ wbId }) => {
      // 返回独立白板id，发送数据的时候需要带上这个参数
      this.state.wbId = wbId
    })
  }
  renderWb () {
    return (
      <View className='container'>
        <Text className='title'>独立白板</Text>
        <View className='wb'>
          <Text className='data'>{this.state.wbMsg || '还没有数据发送过来哟'}</Text>
        </View>
      </View>
    )
  }
  renderForm () {
    return (
      <View className='container'>
        <Text className='title'>控制面板</Text>
        <View className='form'>
          <View className='section'>
            <Text className='label'>width</Text>
            <Input className='input' placeholder='输入白板宽度' value={this.state.width} onChange={v => this.setState({ width: v })} />
          </View>
          <View className='section'>
            <Text className='label'>height</Text>
            <Input className='input' placeholder='输入白板高度' value={this.state.height} onChange={v => this.setState({ height: v })} />
          </View>
          <View className='section'>
            <Button className='button' onPress={() => this.createWb()}>创建白板</Button>
          </View>
        </View>
        <View className='form'>
          <View className='section'>
            <Text className='label'>data</Text>
            <Input className='input' placeholder='输入发送输入' value={this.state.wbData} onChange={v => this.setState({ wbData: v })} />
          </View>
          <View className='section'>
            <Button className='button' onPress={() => this.sendToWb()}>发送数据</Button>
          </View>
        </View>
      </View>
    )
  }
  render () {
    if (this.state.wb) {
      return this.renderWb()
    } else {
      return this.renderForm()
    }
  }
}

export default App
