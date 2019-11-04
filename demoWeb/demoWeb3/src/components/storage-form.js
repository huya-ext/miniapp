import React from 'react'
import {
  Button,
  Form,
  Input,
  List
} from 'antd'

const FormItem = Form.Item
const ListItem = List.Item

class StorageForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      getItem: {
        key: ''
      },
      setItem: {
        key: '',
        value: ''
      },
      removeItem: {
        key: ''
      }
    }
  }
  render () {
    return (
      <List bordered dataSource={[(
        <Form>
          <FormItem label='KEY'>
            <Input onChange={evt => this.setState({ getItem: { key: evt.target.value } })} />
          </FormItem>
          <FormItem>
            <Button onClick={() => this.props.getItem(this.state.getItem.key)}>GET ITEM</Button>
          </FormItem>
        </Form>
      ), (
        <Form>
          <FormItem label='KEY'>
            <Input onChange={evt => this.setState({
              setItem: {
                ...this.state.setItem,
                key: evt.target.value
              }
            })} />
          </FormItem>
          <FormItem label='VALUE'>
            <Input onChange={evt => this.setState({
              setItem: {
                ...this.state.setItem,
                value: evt.target.value
              }
            })} />
          </FormItem>
          <FormItem>
            <Button onClick={() => this.props.setItem(this.state.setItem.key, this.state.setItem.value)}>SET ITEM</Button>
          </FormItem>
        </Form>
      ), (
        <Button onClick={() => this.props.getKeys()}>GET KEYS</Button>
      ), (
        <Form>
          <FormItem label='KEY'>
            <Input onChange={evt => this.setState({ removeItem: { key: evt.target.value } })} />
          </FormItem>
          <FormItem>
            <Button onClick={() => this.props.removeItem(this.state.removeItem.key)}>REMOVE ITEM</Button>
          </FormItem>
        </Form>
      )]} renderItem={a => (<ListItem>{a}</ListItem>)} style={{ marginBottom: '16px' }} />
    )
  }
}

export default StorageForm
