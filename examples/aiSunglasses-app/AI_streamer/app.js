import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './app.hycss'

const { View, Text, Button, Image } = UI
let timer = null; //定时器，用于节流

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      wbId: "",
      wb:false,
      wb_width: 1280,  //白板的分辨率，影响白板显示清晰度
      wb_height: 720,  //白板的分辨率，影响白板显示清晰度
      recognition: {
        canvas: {
          width: 0,
          height: 0
        },
        faces: [{
          faceRect: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          },
          landmarks106: []
        }]
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
          callback: data => {
            const state = JSON.parse(data);
            this.setState(state);
            this.setState({wb:true});
          }
        })
      }
    })
  }

  //在组件内加入创建白板函数
  createWb () {
    const { recognition, wb_width, wb_height } = this.state;
    const { canvas } = recognition;
    const { width , height } = canvas;
    let args = {
      type : "EXTRA",
      wbName : 'foo',
      offsetX: 0,
      offsetY: 0,
      canvasWidth : width,
      canvasHeight: height,
      width: wb_width,
      height: wb_height
    }
    hyExt.stream.createWB(args)
      .then(({ wbId }) => {
        this.setState({wbId:wbId});
      }).catch(err => {
        console.log(err);
      })
  }

  sendToWb () {
    if(this.state.wbId){
      const data = JSON.stringify(this.state);
      hyExt.stream.sendToExtraWhiteBoard({
        wbId: this.state.wbId,
        data
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

  componentDidMount () {
    const { wb_width, wb_height } = this.state;
    hyExt.reg.onFacialLandmarkDetection({
      width: wb_width,
      height: wb_height,
      callback: recognition => {
        this.setState({ recognition });    
        this.throttle(this.sendToWb,100);
        if(!this.state.wbId)
          this.createWb();
      }
    });
  }

  renderForm () {
    return (
      <View className='container'>
        
      </View>
    )
  }

  renderWb () {
    const { recognition , wb_height , wb_width } = this.state;
    const { canvas, faces } = recognition;

    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

    if(faces[0].landmarks106[74]&&faces[0].landmarks106[77]){
      x1 = faces[0].landmarks106[74].x;
      y1 = faces[0].landmarks106[74].y;
      x2 = faces[0].landmarks106[77].x;
      y2 = faces[0].landmarks106[77].y;
    }

    return (
      <View className='container'>        
        {
          faces[0].landmarks106[74]&&
          <Image 
            src={require('../assets/1.png')}
            
            style={{
              position: 'absolute',
              left: wb_width * ((x1 - (x2-x1)) / canvas.width),
              top:  wb_height * ((y1 - (x2-x1)) / canvas.height),
              width: wb_width * (x2-x1) / canvas.width * 3,
              height:  wb_height * (x2-x1) / canvas.height * 2
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
