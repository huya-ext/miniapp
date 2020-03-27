import React, { Component } from 'react'
import { UI } from '@hyext/hy-ui'

import styles from '../../common/styles'
import FormItem from '../../common/FormItem'
import SubmitButton from '../../common/SubmitButton'
import LogPanel from '../../common/LogPanel'
import Select from '../../common/Select'

const { Text, Form, Input, ScrollView, Switch, Checkbox } = UI

export default class Demo extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }

    this.commonLog = ((...args) => {
      this.log('触发回调：' + JSON.stringify(args))
    }).bind(this)
  }
  submit_hyExt_stream_addExtraWhiteBoard () {
    let args = []
    args[0] = {}
    args[0].param = {}
    try {
      args[0].param = JSON.parse(this.state.hyExt_stream_addExtraWhiteBoard_0_param)
    } catch (_) {}
    args[0].width = Number(this.state.hyExt_stream_addExtraWhiteBoard_0_width) || 300
    args[0].height = Number(this.state.hyExt_stream_addExtraWhiteBoard_0_height) || 300
    this.log('创建小程序独立白板：' + JSON.stringify(args))
    global.hyExt.stream.addExtraWhiteBoard(args[0]).then(resp => {
      this.log('创建小程序独立白板成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('创建小程序独立白板失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_removeExtraWhiteBoard () {
    let args = []
    args[0] = {}
    args[0].wbId = this.state.hyExt_stream_removeExtraWhiteBoard_0_wbId || ""
    this.log('移除小程序独立白板：' + JSON.stringify(args))
    global.hyExt.stream.removeExtraWhiteBoard(args[0]).then(() => {
      this.log('移除小程序独立白板成功')
    }).catch(err => {
      this.log('移除小程序独立白板失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_sendToExtraWhiteBoard () {
    let args = []
    args[0] = {}
    args[0].wbId = this.state.hyExt_stream_sendToExtraWhiteBoard_0_wbId || ""
    args[0].data = this.state.hyExt_stream_sendToExtraWhiteBoard_0_data || ""
    this.log('发送消息到小程序独立白板：' + JSON.stringify(args))
    global.hyExt.stream.sendToExtraWhiteBoard(args[0]).then(() => {
      this.log('发送消息到小程序独立白板成功')
    }).catch(err => {
      this.log('发送消息到小程序独立白板失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_onExtraWhiteBoardMessage () {
    let args = []
    args[0] = {}
    args[0].callback = this.commonLog
    this.log('监听小程序独立白板消息：' + JSON.stringify(args))
    global.hyExt.stream.onExtraWhiteBoardMessage(args[0]).then(() => {
      this.log('监听小程序独立白板消息成功')
    }).catch(err => {
      this.log('监听小程序独立白板消息失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_addWhiteBoard () {
    let args = []
    args[0] = {}
    args[0].x = Number(this.state.hyExt_stream_addWhiteBoard_0_x) || 0
    args[0].y = Number(this.state.hyExt_stream_addWhiteBoard_0_y) || 0
    args[0].width = Number(this.state.hyExt_stream_addWhiteBoard_0_width) || 300
    args[0].height = Number(this.state.hyExt_stream_addWhiteBoard_0_height) || 300
    this.log('创建小程序普通白板：' + JSON.stringify(args))
    global.hyExt.stream.addWhiteBoard(args[0]).then(() => {
      this.log('创建小程序普通白板成功')
    }).catch(err => {
      this.log('创建小程序普通白板失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_removeWhiteBoard () {
    this.log('移除小程序普通白板')
    global.hyExt.stream.removeWhiteBoard().then(() => {
      this.log('移除小程序普通白板成功')
    }).catch(err => {
      this.log('移除小程序普通白板失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_addImageLayer () {
    let args = []
    args[0] = {}
    args[0].md5 = this.state.hyExt_stream_addImageLayer_0_md5 || ""
    args[0].frameRate = Number(this.state.hyExt_stream_addImageLayer_0_frameRate) || 0
    this.log('创建小程序图片图层：' + JSON.stringify(args))
    global.hyExt.stream.addImageLayer(args[0]).then(resp => {
      this.log('创建小程序图片图层成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('创建小程序图片图层失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_removeImageLayer () {
    let args = []
    args[0] = {}
    args[0].layerId = this.state.hyExt_stream_removeImageLayer_0_layerId || ""
    this.log('移除小程序图片图层：' + JSON.stringify(args))
    global.hyExt.stream.removeImageLayer(args[0]).then(() => {
      this.log('移除小程序图片图层成功')
    }).catch(err => {
      this.log('移除小程序图片图层失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_enableFaceEffect () {
    let args = []
    args[0] = {}
    args[0].md5 = this.state.hyExt_stream_enableFaceEffect_0_md5 || ""
    args[0].enable = !!this.state.hyExt_stream_enableFaceEffect_0_enable
    this.log('使用脸部效果：' + JSON.stringify(args))
    global.hyExt.stream.enableFaceEffect(args[0]).then(() => {
      this.log('使用脸部效果成功')
    }).catch(err => {
      this.log('使用脸部效果失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_addExeWhiteBoard () {
    let args = []
    args[0] = {}
    args[0].shareHandler = this.state.hyExt_stream_addExeWhiteBoard_0_shareHandler || ""
    args[0].x = Number(this.state.hyExt_stream_addExeWhiteBoard_0_x) || 0
    args[0].y = Number(this.state.hyExt_stream_addExeWhiteBoard_0_y) || 0
    args[0].width = Number(this.state.hyExt_stream_addExeWhiteBoard_0_width) || 0
    args[0].height = Number(this.state.hyExt_stream_addExeWhiteBoard_0_height) || 0
    this.log('创建小程序EXE白板：' + JSON.stringify(args))
    global.hyExt.stream.addExeWhiteBoard(args[0]).then(() => {
      this.log('创建小程序EXE白板成功')
    }).catch(err => {
      this.log('创建小程序EXE白板失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_removeExeWhiteBoard () {
    this.log('移除小程序EXE白板')
    global.hyExt.stream.removeExeWhiteBoard().then(() => {
      this.log('移除小程序EXE白板成功')
    }).catch(err => {
      this.log('移除小程序EXE白板失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_addTextLayer () {
    let args = []
    args[0] = {}
    args[0].layerId = this.state.hyExt_stream_addTextLayer_0_layerId || ""
    args[0].text = this.state.hyExt_stream_addTextLayer_0_text || ""
    args[0].fontFamily = this.state.hyExt_stream_addTextLayer_0_fontFamily || ""
    args[0].fontSize = Number(this.state.hyExt_stream_addTextLayer_0_fontSize) || 0
    args[0].fontColor = this.state.hyExt_stream_addTextLayer_0_fontColor || ""
    args[0].useBackground = !!this.state.hyExt_stream_addTextLayer_0_useBackground
    args[0].backgroundColor = this.state.hyExt_stream_addTextLayer_0_backgroundColor || ""
    args[0].alpha = Number(this.state.hyExt_stream_addTextLayer_0_alpha) || 0
    args[0].bold = !!this.state.hyExt_stream_addTextLayer_0_bold
    args[0].italic = !!this.state.hyExt_stream_addTextLayer_0_italic
    args[0].underline = !!this.state.hyExt_stream_addTextLayer_0_underline
    args[0].scroll = !!this.state.hyExt_stream_addTextLayer_0_scroll
    this.log('创建小程序文字图层：' + JSON.stringify(args))
    global.hyExt.stream.addTextLayer(args[0]).then(resp => {
      this.log('创建小程序文字图层成功，返回：' + JSON.stringify(resp))
    }).catch(err => {
      this.log('创建小程序文字图层失败，错误信息：' + err.message)
    })
  }
  submit_hyExt_stream_removeTextLayer () {
    let args = []
    args[0] = {}
    args[0].layerId = this.state.hyExt_stream_removeTextLayer_0_layerId || ""
    this.log('移除小程序文字图层：' + JSON.stringify(args))
    global.hyExt.stream.removeTextLayer(args[0]).then(() => {
      this.log('移除小程序文字图层成功')
    }).catch(err => {
      this.log('移除小程序文字图层失败，错误信息：' + err.message)
    })
  }
  render () {
    return (
      <ScrollView
        testID='scroller'
        style={{...styles.body, backgroundColor: '#eee'}}>
        <Text style={styles.header}>hyExt.stream.addExtraWhiteBoard</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='param'>
            <Input placeholder='请输入独立白板的初始参数'
              value={this.state.hyExt_stream_addExtraWhiteBoard_0_param || ''}
              onChange={v => this.setState({ hyExt_stream_addExtraWhiteBoard_0_param: v })} />
          </FormItem>
          <FormItem label='width'>
            <Input placeholder='请输入独立白板的宽度'
              value={this.state.hyExt_stream_addExtraWhiteBoard_0_width || ''}
              onChange={v => this.setState({ hyExt_stream_addExtraWhiteBoard_0_width: v })} />
          </FormItem>
          <FormItem label='height'>
            <Input placeholder='请输入独立白板的高度'
              value={this.state.hyExt_stream_addExtraWhiteBoard_0_height || ''}
              onChange={v => this.setState({ hyExt_stream_addExtraWhiteBoard_0_height: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_addExtraWhiteBoard.bind(this)}>创建小程序独立白板</SubmitButton>
        <Text style={styles.header}>hyExt.stream.removeExtraWhiteBoard</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='wbId'>
            <Input placeholder='请输入独立白板的Id'
              value={this.state.hyExt_stream_removeExtraWhiteBoard_0_wbId || ''}
              onChange={v => this.setState({ hyExt_stream_removeExtraWhiteBoard_0_wbId: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_removeExtraWhiteBoard.bind(this)}>移除小程序独立白板</SubmitButton>
        <Text style={styles.header}>hyExt.stream.sendToExtraWhiteBoard</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='wbId'>
            <Input placeholder='请输入独立白板的Id'
              value={this.state.hyExt_stream_sendToExtraWhiteBoard_0_wbId || ''}
              onChange={v => this.setState({ hyExt_stream_sendToExtraWhiteBoard_0_wbId: v })} />
          </FormItem>
          <FormItem label='data'>
            <Input placeholder='请输入要发送的消息'
              value={this.state.hyExt_stream_sendToExtraWhiteBoard_0_data || ''}
              onChange={v => this.setState({ hyExt_stream_sendToExtraWhiteBoard_0_data: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_sendToExtraWhiteBoard.bind(this)}>发送消息到小程序独立白板</SubmitButton>
        <Text style={styles.header}>hyExt.stream.onExtraWhiteBoardMessage</Text>
        <SubmitButton onPress={this.submit_hyExt_stream_onExtraWhiteBoardMessage.bind(this)}>监听小程序独立白板消息</SubmitButton>
        <Text style={styles.header}>hyExt.stream.addWhiteBoard</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='x'>
            <Input placeholder='请输入普通白板的左上角横坐标'
              value={this.state.hyExt_stream_addWhiteBoard_0_x || ''}
              onChange={v => this.setState({ hyExt_stream_addWhiteBoard_0_x: v })} />
          </FormItem>
          <FormItem label='y'>
            <Input placeholder='请输入普通白板的左上角纵坐标'
              value={this.state.hyExt_stream_addWhiteBoard_0_y || ''}
              onChange={v => this.setState({ hyExt_stream_addWhiteBoard_0_y: v })} />
          </FormItem>
          <FormItem label='width'>
            <Input placeholder='请输入普通白板的宽度'
              value={this.state.hyExt_stream_addWhiteBoard_0_width || ''}
              onChange={v => this.setState({ hyExt_stream_addWhiteBoard_0_width: v })} />
          </FormItem>
          <FormItem label='height'>
            <Input placeholder='请输入普通白板的高度'
              value={this.state.hyExt_stream_addWhiteBoard_0_height || ''}
              onChange={v => this.setState({ hyExt_stream_addWhiteBoard_0_height: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_addWhiteBoard.bind(this)}>创建小程序普通白板</SubmitButton>
        <Text style={styles.header}>hyExt.stream.removeWhiteBoard</Text>
        <SubmitButton onPress={this.submit_hyExt_stream_removeWhiteBoard.bind(this)}>移除小程序普通白板</SubmitButton>
        <Text style={styles.header}>hyExt.stream.addImageLayer</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='md5'>
            <Input placeholder='请输入图片资源md5'
              value={this.state.hyExt_stream_addImageLayer_0_md5 || ''}
              onChange={v => this.setState({ hyExt_stream_addImageLayer_0_md5: v })} />
          </FormItem>
          <FormItem label='frameRate'>
            <Input placeholder='请输入帧率'
              value={this.state.hyExt_stream_addImageLayer_0_frameRate || ''}
              onChange={v => this.setState({ hyExt_stream_addImageLayer_0_frameRate: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_addImageLayer.bind(this)}>创建小程序图片图层</SubmitButton>
        <Text style={styles.header}>hyExt.stream.removeImageLayer</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='layerId'>
            <Input placeholder='请输入图片图层id'
              value={this.state.hyExt_stream_removeImageLayer_0_layerId || ''}
              onChange={v => this.setState({ hyExt_stream_removeImageLayer_0_layerId: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_removeImageLayer.bind(this)}>移除小程序图片图层</SubmitButton>
        <Text style={styles.header}>hyExt.stream.enableFaceEffect</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='md5'>
            <Input placeholder='请输入变脸效果的md5'
              value={this.state.hyExt_stream_enableFaceEffect_0_md5 || ''}
              onChange={v => this.setState({ hyExt_stream_enableFaceEffect_0_md5: v })} />
          </FormItem>
          <FormItem label='enable'>
            <Switch value={this.state.hyExt_stream_enableFaceEffect_0_enable || false}
              onChange={v => this.setState({ hyExt_stream_enableFaceEffect_0_enable: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_enableFaceEffect.bind(this)}>使用脸部效果</SubmitButton>
        <Text style={styles.header}>hyExt.stream.addExeWhiteBoard</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='shareHandler'>
            <Input placeholder='请输入EXE的共享句柄'
              value={this.state.hyExt_stream_addExeWhiteBoard_0_shareHandler || ''}
              onChange={v => this.setState({ hyExt_stream_addExeWhiteBoard_0_shareHandler: v })} />
          </FormItem>
          <FormItem label='x'>
            <Input placeholder='请输入EXE白板的左上角横坐标'
              value={this.state.hyExt_stream_addExeWhiteBoard_0_x || ''}
              onChange={v => this.setState({ hyExt_stream_addExeWhiteBoard_0_x: v })} />
          </FormItem>
          <FormItem label='y'>
            <Input placeholder='请输入EXE白板的左上角纵坐标'
              value={this.state.hyExt_stream_addExeWhiteBoard_0_y || ''}
              onChange={v => this.setState({ hyExt_stream_addExeWhiteBoard_0_y: v })} />
          </FormItem>
          <FormItem label='width'>
            <Input placeholder='请输入EXE白板的宽度'
              value={this.state.hyExt_stream_addExeWhiteBoard_0_width || ''}
              onChange={v => this.setState({ hyExt_stream_addExeWhiteBoard_0_width: v })} />
          </FormItem>
          <FormItem label='height'>
            <Input placeholder='请输入EXE白板的高度'
              value={this.state.hyExt_stream_addExeWhiteBoard_0_height || ''}
              onChange={v => this.setState({ hyExt_stream_addExeWhiteBoard_0_height: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_addExeWhiteBoard.bind(this)}>创建小程序EXE白板</SubmitButton>
        <Text style={styles.header}>hyExt.stream.removeExeWhiteBoard</Text>
        <SubmitButton onPress={this.submit_hyExt_stream_removeExeWhiteBoard.bind(this)}>移除小程序EXE白板</SubmitButton>
        <Text style={styles.header}>hyExt.stream.addTextLayer</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='layerId'>
            <Input placeholder='请输入文字图层id'
              value={this.state.hyExt_stream_addTextLayer_0_layerId || ''}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_layerId: v })} />
          </FormItem>
          <FormItem label='text'>
            <Input placeholder='请输入文字图层内容'
              value={this.state.hyExt_stream_addTextLayer_0_text || ''}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_text: v })} />
          </FormItem>
          <FormItem label='fontFamily'>
            <Input placeholder='请输入文字图层字体'
              value={this.state.hyExt_stream_addTextLayer_0_fontFamily || ''}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_fontFamily: v })} />
          </FormItem>
          <FormItem label='fontSize'>
            <Input placeholder='请输入文字图层字体大小'
              value={this.state.hyExt_stream_addTextLayer_0_fontSize || ''}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_fontSize: v })} />
          </FormItem>
          <FormItem label='fontColor'>
            <Input placeholder='请输入字图层字体颜色'
              value={this.state.hyExt_stream_addTextLayer_0_fontColor || ''}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_fontColor: v })} />
          </FormItem>
          <FormItem label='useBackground'>
            <Switch value={this.state.hyExt_stream_addTextLayer_0_useBackground || false}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_useBackground: v })} />
          </FormItem>
          <FormItem label='backgroundColor'>
            <Input placeholder='请输入文字图层背景颜色'
              value={this.state.hyExt_stream_addTextLayer_0_backgroundColor || ''}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_backgroundColor: v })} />
          </FormItem>
          <FormItem label='alpha'>
            <Input placeholder='请输入文字图层不透明度'
              value={this.state.hyExt_stream_addTextLayer_0_alpha || ''}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_alpha: v })} />
          </FormItem>
          <FormItem label='bold'>
            <Switch value={this.state.hyExt_stream_addTextLayer_0_bold || false}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_bold: v })} />
          </FormItem>
          <FormItem label='italic'>
            <Switch value={this.state.hyExt_stream_addTextLayer_0_italic || false}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_italic: v })} />
          </FormItem>
          <FormItem label='underline'>
            <Switch value={this.state.hyExt_stream_addTextLayer_0_underline || false}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_underline: v })} />
          </FormItem>
          <FormItem label='scroll'>
            <Switch value={this.state.hyExt_stream_addTextLayer_0_scroll || false}
              onChange={v => this.setState({ hyExt_stream_addTextLayer_0_scroll: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_addTextLayer.bind(this)}>创建小程序文字图层</SubmitButton>
        <Text style={styles.header}>hyExt.stream.removeTextLayer</Text>
        <Form style={{marginTop: 20}}>
          <FormItem label='layerId'>
            <Input placeholder='请输入文字图层id'
              value={this.state.hyExt_stream_removeTextLayer_0_layerId || ''}
              onChange={v => this.setState({ hyExt_stream_removeTextLayer_0_layerId: v })} />
          </FormItem>
        </Form>
        <SubmitButton onPress={this.submit_hyExt_stream_removeTextLayer.bind(this)}>移除小程序文字图层</SubmitButton>
        <LogPanel ref={logPanel => {
          if (logPanel) {
            this.log = logPanel.log.bind(logPanel)
          }
        }} />
      </ScrollView>
    )
  }
}