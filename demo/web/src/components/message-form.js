import React from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  List
} from 'antd'

const { Item } = Form
const { Option } = Select
const ListItem = List.Item

class MessageForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      onMessage: {
        type: 'observer',
        event: ''
      },
      emitMessage: {
        event: '',
        message: ''
      }
    }
  }
  render () {
    return (
      <List bordered style={{ marginBottom: '16px' }}>
        <ListItem>
          <Form>
            <Item label='监听消息类型'>
              <Select defaultValue='observer' onChange={value => this.setState({
                onMessage: {
                  ...this.state.onMessage,
                  type: value
                }
              })} >
                <Option value='observer'>扩展消息</Option>
                <Option value='context'>宿主消息</Option>
              </Select>
            </Item>
            <Item label='事件名'>
              <Input onChange={evt => this.setState({
                onMessage: {
                  ...this.state.onMessage,
                  event: evt.target.value
                }
              })} />
            </Item>
            <Item>
              <Button onClick={() => this.props.onMessage({ ...this.state.onMessage })}>监听消息</Button>
            </Item>
          </Form>
        </ListItem>
        <ListItem>
          <Form>
            <Item label='事件名'>
              <Input onChange={evt => this.setState({
                emitMessage: {
                  ...this.state.emitMessage,
                  event: evt.target.value
                }
              })} />
            </Item>
            <Item label='事件内容'>
              <Input onChange={evt => this.setState({
                emitMessage: {
                  ...this.state.emitMessage,
                  message: evt.target.value
                }
              })} />
            </Item>
            <Item>
              <Button onClick={() => this.props.emitMessage({ ...this.state.emitMessage })}>发送消息</Button>
            </Item>
          </Form>
        </ListItem>
      </List>
    )
  }
}

export default MessageForm
