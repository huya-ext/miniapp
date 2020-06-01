import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import Popbox from './components/Popbox'
import './app.hycss'
const hyExt = global.hyExt;
const { View, Text, Button, Input, ScrollView} = UI

class App extends Component {
  constructor () {
    super()

    this.state = {
      wb: false, // 代码是否处于独立白板模式
      wbData: '', // 发送到独立白板的数据，驱动独立白板进行视图更新
      wbMsg: '', // 独立白板接收到的数据，用来更新独立白板视图
      wbId: '', // 独立白板id
      giftMsg: [],
      showPop: false,
      showEnt: true// 显示小程序入口
    }

    // 调用sdk获取初始化参数的api，判断是否处于独立白板模式
    hyExt.env.getInitialParam().then(param => {
      if (param.wb) {
        // 初始化参数包含wb参数，说明处于独立白板模式
        this.setState({
          wb: true
        })
        // 监听从原来小程序发送过来的独立白板数据
        hyExt.stream.onExtraWhiteBoardMessage({
          // 接收到数据，刷新视图
          callback: data => {this.setState({ wbMsg: data });}
        })
      }
    })
  }

  componentDidMount() {
    this.onGiftChange();
  }

  emitMessage(msg){
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

  showPophandle(state){
    this.setState({showPop:state});
  }
  
  sendToWb(){
    let { wbData, wbId } = this.state;
    hyExt.order.reportText({text:wbData}).then(() => {
      console.log('小程序文本秩序审核成功');
      this.emitMessage(wbData);
      if(this.state.wbId){
        hyExt.stream.sendToExtraWhiteBoard({
          wbId,
          data: wbData
        })
        console.log("发送数据到白板成功")
      }
    }).catch(err => {
      console.log('小程序文本秩序审核失败，错误信息：' + err.message)
      this.showPophandle(true);
    });
  }

  showEntry(){
    let { showEnt } = this.state;
    let args = {
      extTypes : "web_video_com,app_panel" //入口相应面板参数，有web主站和app端
    }
    if(!showEnt){
      hyExt.action.showEntrance(args).then(() => {
          console.log('显示客户端小程序入口成功');
          this.setState({showEnt: !showEnt});  
      })
      .catch(err => {
          console.log('显示客户端小程序入口失败，错误信息：' + err.message)
      })
    }
    else{
      hyExt.action.hideEntrance(args).then(() => {
        console.log('隐藏客户端小程序入口成功');
        this.setState({showEnt: !showEnt});   
      })
      .catch(err => {
        console.log('隐藏客户端小程序入口失败，错误信息：' + err.message)
      })
    }
  }

  createWb () {
    let width = 750
    let height = 1200
    // 创建独立白板
    hyExt.stream.addExtraWhiteBoard({
      width, height
    }).then(({ wbId }) => {
      // 返回独立白板id，发送数据的时候需要带上这个参数
      this.state.wbId = wbId
    }).catch((err)=>{
      console.log(err)
    })
  }
  renderWb () {
    return (
      <View>
        <View className='wb'>
          <Text className='data'>{this.state.wbMsg || ''}</Text>
        </View>
      </View>
    )
  }
  renderForm () {
    const { giftMsg, showPop, showEnt} = this.state;
    const giftMsgs = giftMsg.map((item,index)=>{
      return (<Text>{item}</Text>)
    })
    return (
      <View className='container'>
        <Text>直播间礼物信息</Text>
        <View className="giftMsg">
          <ScrollView>
            {giftMsgs}
          </ScrollView>
        </View>
        <View>
          <View className='section'>
            <Text>数据</Text>
            <Input className='input' blurOnSubmit={false} placeholder='输入发送输入' value={this.state.wbData} onChange={v => this.setState({ wbData: v })} />
          </View>
          <View className='section'>
            <Button className='button' onPress={() => this.sendToWb()}>发送数据</Button>
         </View>
          <View className='section'>
            <Button className='button' onPress={() => this.createWb()}>创建白板</Button>
          </View>
          <View className='section'>
            <Button className='button' onPress={() => this.showEntry()}>{showEnt?"隐藏":"显示"}入口</Button>
          </View>
        </View>
        {
          showPop&&<Popbox showPophandle={this.showPophandle.bind(this)}/>
        }
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

export default App;