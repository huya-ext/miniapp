import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './index.hycss'

const { Text, View } = UI

const fonts = [
  '".PingFang HK"',
  '".PingFang SC"',
  '".PingFang TC"',
  '"AR PL UKai CN"',
  '"AR PL UKai HK"',
  '"AR PL UKai TW"',
  '"AR PL UKai TW MBE"',
  '"BENMO Jingyuan 3D"',
  '"DejaVu Sans"',
  '"DejaVu Sans Mono"',
  '"DejaVu Serif"',
  '"Microsoft YaHei"',
  '"Microsoft YaHei UI"',
  '"PingFang HK"',
  '"PingFang SC"',
  '"PingFang TC"',
  '"STSong"',
  '"Songti SC"',
  '"Songti TC"',
  '"Source Han Sans HC"',
  '"Source Han Sans SC"',
  '"Source Han Serif SC"',
  '"Source Han Serif TC"'
]

export default class WhiteBoard extends Component {
  constructor (props) {
    super(props)

    this.state = { data: '', fontFamily: 'PingFang', fontIndex: 0 }

    global.hyExt.stream.onExtraWhiteBoardMessage({
      callback: data => {
        let fontFamily = this.state.fontFamily
        try {
          let json = JSON.parse(data)
          if (json && json.fontFamily) {
            fontFamily = json.fontFamily
          }
        } catch (_) {}

        this.setState({ data, fontFamily })
      }
    })
  }
  componentDidMount () {
    this.tId = setInterval(() => {
      this.setState({
        fontIndex: (this.state.fontIndex + 1) % fonts.length
      })
    }, 2000)
  }
  componentWillUnmount () {
    clearInterval(this.tId)
  }
  render () {
    return (
      <View className='wrap'>
        <Text className='font-hei' style={{ fontFamily: this.state.fontFamily, color: '#000' }}>接收到数据：{this.state.data || '暂时没有' }</Text>
        <Text className='font-hei' style={{ fontFamily: fonts[this.state.fontIndex], color: '#000' }}>{fonts[this.state.fontIndex]}</Text>
        <View className='img' />
      </View>
    )
  }
}
