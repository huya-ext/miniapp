import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './app.hycss'
import SelectGift from './components/SelectGift'
import SelectNum from './components/SelectNum'
const hyExt = global.hyExt
const { View, Text, Button } = UI

class App extends Component {
  constructor(initialProps) {
    super();
    this.state = {
      giftInfo: [],
      giftIndex: 1,
      giftNum: 1,
      textBar: "",
      default_step: 1
    }
  }

  getGiftInfo(){
    hyExt.context.getGiftConf().then(giftInfo => {
      if(giftInfo){
        this.setState({
          giftInfo: giftInfo.filter((item,i)=>{
            return item.giftGif&&item.giftName;
          })
        })
      }
    })
  }

  messageEventListener(){
    hyExt.observer.on('message-push', res => {
      console.log("[message]:",res);
      this.setState({
        textBar: res
      })
    })
  }

  changeGift(step){
    if(step === undefined)  //无参数则按上一次操作来
      step = this.state.default_step;
    else
      this.setState({default_step:step})  //有参数则保存操作

    var {giftIndex} = this.state;
    const maxlen = this.state.giftInfo.length;
    giftIndex = (giftIndex + step + maxlen)%maxlen;

    this.setState({
      giftIndex: giftIndex
    })
  }

  changeNum(step){
    var {giftNum} = this.state;
    giftNum = (giftNum + step)>1?(giftNum + step):1;
    this.setState({
      giftNum: giftNum
    })
  }

  componentDidMount() {
    hyExt.onLoad(()=> {
      hyExt.context.getUserInfo().then(userInfo => {
        hyExt.logger.info('获取用户信息成功', userInfo);
        this.getGiftInfo();
        this.messageEventListener();
      })
    });
  }

  sendGift(){
    const giftCount = this.state.giftNum;
    const giftIndex = this.state.giftIndex;
    const giftId = this.state.giftInfo[giftIndex].giftId;
    hyExt.context.sendGift({giftId,giftCount}).then((result)=>{
      console.log(result);
    }).catch((err)=>{
      console.log(err);
    })
  }npx

  render () {
    
    const {giftInfo, giftIndex, giftNum, textBar} = this.state;
    return (
      giftInfo[giftIndex]?
      <View className="container">
        <View className="text">
          <Text className="title">公告栏（主播留言）</Text>
          <Text className="msg">{textBar?textBar:"暂未收到主播发送的消息~"}</Text>
        </View>
        <SelectGift data={giftInfo[giftIndex]} changeGift={this.changeGift.bind(this)}></SelectGift>
        <SelectNum num={giftNum} changeNum={this.changeNum.bind(this)}></SelectNum>
        <Button type='primary' className="senderButton" onPress={()=>this.sendGift()}>赠送</Button>
      </View>        
      :
      <Text>loading......</Text>
    )
  }
}

export default App