import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './app.hycss'
import { createOpenWS, WSEventIds } from "@hyext/communication";

const { View, Text } = UI

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      data:[]
    }
  }
  componentDidMount() {
    const ws = createOpenWS({
      appId: 'e0a619f3586f6373',//'your_appid',// 开发者id
      secret: '25b431e05f6d8b109c4aea96830c6596',//'your_secret', // 开发者密钥
      expireTimeDelta: 60 * 10, // 10分钟
      extUuid: 'usxomypz',//'your_extUuid',// 小程序id
      roomId: 23022712,//111222, // 直播间ID
      debug: true
    })

    // 监听ws内置事件
    ws.on(WSEventIds.open, (data) => {
      this.setState({data:[...this.state.data,'The ws has opened.']})
    })
    ws.on(WSEventIds.close, (data) => {
      this.setState({data:[...this.state.data,'The ws has closed.']})
    })

    // 监听open-api弹幕事件
    ws.on('getMessageNotice', (data) => {
      console.log(data)
      // this.setState({data:[...this.state.data, JSON.stringify(data)]})
      this.setState({data:[...this.state.data, data.sendNick + ': ' + data.content]})
    })
  }

  render () {
    return (
      <View className="container">
        {this.state.data.map((item,i)=>{
          return <Text key={i}>{i+'. '}{item}</Text>
        })}
      </View>
    )
  }
}

export default App
