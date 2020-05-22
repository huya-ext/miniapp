import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './app.hycss'
const hyExt = global.hyExt;
const { View, Text, Button, Input, ScrollView} = UI

class App extends Component {
  constructor () {
    super()

    this.state = {
      msg: '', // 广播数据
      giftMsg: []
    }

  }

  componentDidMount() {
    this.onGiftChange();
  }

  emitMessage(){
    let { msg } = this.state;
    hyExt.observer.emit('message-push',msg).then((res)=>{
      console.log("向客户端小程序广播信息成功！")}
    ).catch((err)=>{
      console.log(err);
    });
  }

  showGiftChange(data){
      const {itemName, sendNick, sendItemCount} = data;
      let old_msg = this.state.giftMsg;
      const msg = `感谢${sendNick}送的${sendItemCount}个${itemName}~`;
      old_msg.push(msg);
      if(old_msg.length>30)
        old_msg.shift();
      this.setState({giftMsg:old_msg});
  }

  onGiftChange(){
    callback = this.showGiftChange.bind(this);
    hyExt.context.onGiftChange({}, callback).then(() => {
      console.log('监听当前直播间礼物变化消息成功')
    }).catch(err => {
      console.log('监听当前直播间礼物变化消息失败，错误信息：' + err.message)
    })
  }

  render () {
    const {giftMsg} = this.state;
    const giftMsgs = giftMsg.map((item,index)=>{
      return (<Text>{item}</Text>)
    })
    return (
      <View className='container'>
        <Text>直播间礼物信息</Text>
        <View className="giftMsg">
          <ScrollView>{giftMsgs}</ScrollView>
        </View>
        <View>
          <View className='section'>
            <Text>数据</Text>
            <Input className='input' blurOnSubmit={false} placeholder='输入发送输入' value={this.state.msg} onChange={v => this.setState({ msg: v })} />
          </View>
          <View className='section'>
            <Button className='button' onPress={() => this.emitMessage()}>广播数据</Button>
         </View>
        </View>
      </View>
    )
  }
}

export default App;