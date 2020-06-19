import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import './app.hycss'

const { View, Text, Button, Image, Tip } = UI
let timer = null; //定时器，用于节流

class App extends Component {
  constructor (props) {
    super(props)

    //白板的分辨率，影响白板显示清晰度
    this.wb_width = Dimensions.get('window').width * Dimensions.get('window').scale
    this.wb_height = Dimensions.get('window').height * Dimensions.get('window').scale

    // this.wb_width = 720
    // this.wb_height = 1280

    this.wbId = ''

    this.state = {
      wb: false,
      wb_id: '',
      wb_data: {
        width: this.wb_width,
        height: this.wb_height,
        x1: this.wb_width / 16 * 7,
        y1: this.wb_height / 2,
        x2: this.wb_width / 16 * 9,
        y2: this.wb_height / 2
      }
    }

    hyExt.env.getInitialParam().then(param => {
      if (param.wb) {
        // 初始化参数包含wb参数，说明处于独立白板模式
        this.setState({
          wb: true
        })
        // 监听从原来小程序发送过来的独立白板数据
        hyExt.stream.onExtraWhiteBoardMessage({
          // 接收到数据，刷新视图
          callback: data => this.updateWB(JSON.parse(data))
        })
      }
    })

    global.updateWB = state => this.updateWB(state)
  }

  updateWB (state) {
    this.setState(state)
  }

  //在组件内加入创建白板函数
  createWb () {
    const { wb_width, wb_height } = this;

    // let args = {
    //   type : "EXTRA",
    //   wbName : 'foo',
    //   offsetX: 0,
    //   offsetY: 0,
    //   canvasWidth : width,
    //   canvasHeight: height,
    //   width: wb_width,
    //   height: wb_height
    // }
    // hyExt.stream.createWB(args)
    //   .then(({ wbId }) => {
    //     this.setState({wbId:wbId});
    //   }).catch(err => {
    //     console.log(err);
    //   })

    let args = {
      width: wb_width,
      height: wb_height
    }
    hyExt.stream.addExtraWhiteBoard(args)
      .then(({ wbId }) => {
        Tip.show('wbId：' + wbId, 2000, 'center')
        this.setState({ wb_id: wbId})
        this.wbId = wbId
      }).catch(err => {
        Tip.show('创建白板失败：' + err.message, 2000, 'center')
      })
  }

  sendToWb (data) {
    if(this.wbId){
      this.setState({
        wb_data: data
      })
      hyExt.stream.sendToExtraWhiteBoard({
        wbId: this.wbId,
        data: JSON.stringify({ wb_data: data })
      })
    }
  }

  //节流函数
  throttle(func,gapTime) {
    if(!timer){
      func.apply(this);
      timer = setTimeout(()=>{
        timer = null;
      },gapTime);
    }
  }

  getWbDataFromRecognition (recognition) {
    const { canvas, faces } = recognition
    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

    if(faces[0].landmarks106[74]&&faces[0].landmarks106[77]){
      x1 = faces[0].landmarks106[74].x;
      y1 = faces[0].landmarks106[74].y;
      x2 = faces[0].landmarks106[77].x;
      y2 = faces[0].landmarks106[77].y;
    }

    return {
      wb_width: this.wb_width,
      wb_height: this.wb_height,
      width: canvas.width,
      height: canvas.height,
      x1,
      y1,
      x2,
      y2
    }
  }

  renderForm () {
    return (
      <View className='container'>
        <View className='panel'>
          <Button type="primary" size="md" textColorInverse onPress={() => {
            hyExt.reg.onFacialLandmarkDetection({
              callback: recognition => {
                if(!this.wbId) this.createWb()
                this.throttle(() => {
                  this.sendToWb(this.getWbDataFromRecognition(recognition))
                },100);
              }
            })
          }}>开始识别</Button>
          <Text>wb_id: {this.state.wb_id}</Text>
          <Text>wb_data: {JSON.stringify(this.state.wb_data)}</Text>
        </View>  
      </View>
    )
  }

  renderWb () {
    const { wb_height, wb_width } = this
    const { width, height, x1, y1, x2, y2 } = this.state.wb_data;

    const left = wb_width * ((x1 - (x2-x1)) / width) / Dimensions.get('window').scale
    const top = wb_height * ((y1 - (x2-x1)) / height) / Dimensions.get('window').scale
    const h = wb_height * ((x2 - x1) * 2 / height) / Dimensions.get('window').scale
    const w = wb_width * ((x2 - x1) * 3 / width) / Dimensions.get('window').scale

    // return (
    //   <View className='container'>
    //     <View className='block' style={{ width: wb_width / 3, height: wb_height / 3, backgroundColor: '#f00' }} />
    //     <Text className='text'>{JSON.stringify({ wb_width, wb_height, left, top })}</Text>
    //   </View>
    // )

    return (
      <View className='container'>
        <Text className='text'>{JSON.stringify({ wb_height, wb_width, width, height, x1, y1, x2, y2 })}</Text>
        <Text className='text'>{JSON.stringify({ left, top, h, w })}</Text>    
        {
          <Image 
            src={require('../assets/1.png')}
            
            style={{
              position: 'absolute',
              left,
              top,
              height: h,
              width: w,
              backgroundColor: 'red'
            }}
          >
          </Image>
          
        }
      </View>
    )
  }

  render () {
    if(this.state.wb){
      return this.renderWb();
    }else
      return this.renderForm();
  }
}

export default App
