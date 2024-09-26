import React, { Component } from 'react'
import { UI } from '@hyext/hy-ui'
import './style.hycss'
import styles from '../../common/styles'
const { View, Text, Image, Progress } = UI

export default class WB extends Component {
  constructor (props) {
    super(props)
    this.anim = React.createRef();
    this.state = {
      data: {
        title: '',  // 标题
        giftConf: [ // 礼物信息
          // {
          //   giftGif: '', // 礼物图片
          //   now: 0,      // 当前送礼数值
          //   target: 0,   // 礼物目标值
          // }
        ]
      }
    }
  }

  componentDidMount () {
    // 监听小程序独立白板消息
    global.hyExt.stream.onExtraWhiteBoardMessage({
      callback: resp => {
        console.log(666, resp);
        this.setState({
          data: JSON.parse(resp)
        })
      }
    })
  }

  render () {
    const { data } = this.state;

    return (
      <View className='container'>
        <View className='topLeft' />
        <View className='topRight' />
        <View className='bottomLeft' />
        <View className='bottomRight' />
        {/* 标题文案 */}
        <View className="header">
          <Text className="header-text">{data.title || '还没有接受到数据'}</Text>
        </View>

        {/* 礼物进度信息 */}
        {(data.giftConf || []).map((item, idx) => {
          return (
            <View className="gift-list">
              <Image className="gift-img" mode="cover" src={item.giftGif || ''}/>
              <Text style={styles.prgText}>{item.now || 0} / { item.target || 0}</Text>
              <Progress
                easing={true}
                percent={Math.floor((item.now / item.target) * 100)}
                style={styles.prgStyle}
                barStyle={styles.barStyle}
              />
            </View>
          )
        })}
      </View>
    )
  }
}
