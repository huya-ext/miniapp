import React from 'react'
import {
  Button,
  Form,
  Input
} from 'antd'

const { Item } = Form

class SubscribeForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      userNick: ''
    }
  }
  render () {
    return (
      <Form>
        <Item>
          <Button block onClick={() => this.props.leadSubscribe()}>引导订阅</Button>
          <Button block onClick={() => this.props.getSubscribeInfo()}>获取当前订阅状态</Button>
          <Button block onClick={() => this.props.getSubscriberSummary()}>获取当前订阅者概况</Button>
          <Button block onClick={() => this.props.onSubscribeSubmit()}>监听订阅消息</Button>
        </Item>
        <Item label='订阅者昵称'>
          <Input value={this.state.userNick} onChange={evt => this.setState({ userNick: evt.target.value })} />
        </Item>
        <Item>
          <Button style={{ marginRight: '16px' }} onClick={() => this.props.onSubscriberChange({ ...this.state })}>监听订阅者消息</Button>
          <Button onClick={() => this.props.offSubscriberChange()}>取消监听</Button>
        </Item>
      </Form>
    )
  }
}

export default SubscribeForm
