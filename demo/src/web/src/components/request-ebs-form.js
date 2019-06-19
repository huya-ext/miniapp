import React from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber
} from 'antd'

const { Item } = Form
const { Option } = Select

class RequestEbsForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      host: '',
      port: '80',
      path: '',
      httpMethod: 'GET',
      param: ''
    }
  }
  render () {
    return (
      <Form>
        <Item label='主机名'>
          <Input value={this.state.host} onChange={evt => this.setState({ host: evt.target.value })} />
        </Item>
        <Item label='端口号'>
          <InputNumber value={this.state.port} onChange={value => this.setState({ port: value })} />
        </Item>
        <Item label='路径'>
          <Input value={this.state.path} onChange={evt => this.setState({ path: evt.target.value })} />
        </Item>
        <Item label='HTTP方法'>
          <Select value={this.state.httpMethod} onChange={value => this.setState({ httpMethod: value })}>
            <Option value='GET'>GET</Option>
            <Option value='POST'>POST</Option>
          </Select>
        </Item>
        <Item label='参数'>
          <Input value={this.state.param} onChange={evt => this.setState({ param: evt.target.value })} />
        </Item>
        <Item>
          <Button onClick={() => this.props.requestEbs(this.getParams())}>发送请求</Button>
        </Item>
      </Form>
    )
  }
  getParams () {
    let param = this.state.param

    if (param) {
      try {
        param = JSON.parse(param)
      } catch (err) {
        console.warn(err)
        param = {}
      }
    } else {
      param = {}
    }

    return {
      ...this.state,
      param
    }
  }
}

export default RequestEbsForm
