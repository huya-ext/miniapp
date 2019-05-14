import React from 'react'
import {
  Button,
  Form,
  Input,
  InputNumber
} from 'antd'

const { Item } = Form

class BarrageForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      sendNick: '',
      content: '',
      nobleLevel: 0,
      fansLevel: 0
    }
  }
  render () {
    return (
      <Form>
        <Item>
          <Button block onClick={() => this.props.leadBarrage()}>引导发言</Button>
          <Button block onClick={() => this.props.onBarrageSubmit()}>监听当前用户发言消息</Button>
        </Item>
        <Item label='发言者昵称'>
          <Input onChange={evt => this.setState({ sendNick: evt.target.value })} />
        </Item>
        <Item label='发言内容'>
          <Input onChange={evt => this.setState({ content: evt.target.value })} />
        </Item>
        <Item label='贵族等级'>
          <InputNumber onChange={value => this.setState({ nobleLevel: value })} defaultValue={0} />
        </Item>
        <Item label='粉丝等级'>
          <InputNumber onChange={value => this.setState({ fansLevel: value })} defaultValue={0} />
        </Item>
        <Item>
          <Button style={{ marginRight: '16px' }} onClick={() => this.props.onBarrageChange({ ...this.state })}>监听当前直播间发言消息</Button>
          <Button onClick={() => this.props.offBarrageChange()}>取消监听</Button>
        </Item>
      </Form>
    )
  }
}

export default BarrageForm
