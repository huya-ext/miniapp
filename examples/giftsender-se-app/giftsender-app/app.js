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
      textBar: ""
    }
  }

  getGiftInfo(){
    hyExt.context.getGiftConf().then(giftInfo => {
      if(giftInfo){
        this.setState({
          giftInfo: giftInfo
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
  }

  render () {
    
    const {giftInfo, giftIndex, giftNum, textBar} = this.state;

    return (
      giftInfo[giftIndex]?
      <View className="container">
        <SelectGift data={giftInfo[giftIndex]} changeGift={this.changeGift.bind(this)}></SelectGift>
        <Text className="text">{textBar}</Text> 
        <SelectNum num={giftNum} changeNum={this.changeNum.bind(this)}></SelectNum>
        <Button type='primary' className="senderButton" onPress={()=>this.sendGift()}>赠送</Button>
      </View>        
      :
      <Text>loading......</Text>
    )
  }
}

export default App