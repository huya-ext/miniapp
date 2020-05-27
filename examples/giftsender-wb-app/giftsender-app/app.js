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
    hyExt.observer && hyExt.observer.on('message-push', res => {
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
    hyExt.onLoad && hyExt.onLoad(()=> {
        hyExt.context.getUserInfo().then(userInfo => {
            hyExt.logger.info('获取用户信息成功', userInfo);
            this.getGiftInfo();
            this.messageEventListener();
        }).catch(err => {

        })
    });
  }

  sendGift(){
    console.log("1234")
    const giftCount = this.state.giftNum;
    const giftIndex = this.state.giftIndex;
    const giftId = this.state.giftInfo[giftIndex].giftId;
    console.log({giftId,giftCount});
    hyExt.context.sendGift({giftId,giftCount}).then((result)=>{
        console.log(result);

      }
    ).catch((err)=>{
      console.log(err);
    })
  }

  render () {
    
    const temp_gift = {"giftId":20205,
    "giftName":"周年蛋糕",
    "giftLogo":"https://huyaimg.msstatic.com/cdnimage/actprop/20205_1__108_1552620250.jpg?3d6d2b95f760ec51699c20474f2d3cdb",
    "giftGif":"https://huyaimg.msstatic.com/cdnimage/actprop/20205_1__gif_1552619918.gif?611e701a7eb71d3252d8cda791371a10",
    "giftPriceHuya":0.1,
    "giftPriceGreenBean":100,
    "giftPriceWhiteBean":-1};//this.sendGift.bind(this)
    
    const {giftInfo, giftIndex, giftNum, textBar} = this.state;

    console.log(this.state)
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
