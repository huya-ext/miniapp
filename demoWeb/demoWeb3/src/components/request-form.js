import React from 'react'
import {
  Form,
  Input,
  Select,
  Button
} from 'antd'

const { Item } = Form
const { Option } = Select

class RequestForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      header: '',
      url: 'http://v.huya.com/index.php?r=user/liveInfo&uid=50013282',
      method: 'GET',
      data: '',
      dataType: 'json'
    }
  }
  render () {
    return (
      <Form>
        <Item label='头信息'>
          <Input value={this.state.header} onChange={evt => this.setState({ header: evt.target.value })} />
        </Item>
        <Item label='地址'>
          <Input value={this.state.url} onChange={evt => this.setState({ url: evt.target.value })} />
        </Item>
        <Item label='HTTP方法'>
          <Select value={this.state.method} onChange={value => this.setState({ method: value })}>
            <Option value='GET'>GET</Option>
            <Option value='POST'>POST</Option>
          </Select>
        </Item>
        {
          this.state.method === 'POST'
            ? (
              <Item label='POST参数'>
                <Input value={this.state.data} onChange={evt => this.setState({ data: evt.target.value })} />
              </Item>
            )
            : ''
        }
        <Item label='响应格式'>
          <Select value={this.state.dataType} onChange={value => this.setState({ dataType: value })}>
            <Option value='json'>JSON</Option>
            <Option value='text'>TEXT</Option>
          </Select>
        </Item>
        <Item>
          <Button onClick={() => this.props.request(this.getParams())}>发送请求</Button>
        </Item>
      </Form>
    )
  }
  getParams () {
    let data = this.state.data

    if (data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        console.warn(err)
        data = {}
      }
    } else {
      data = {}
    }

    let header = this.state.header

    if (header) {
      try {
        header = JSON.parse(header)
      } catch (err) {
        console.warn(err)
        header = {}
      }
    } else {
      header = {}
    }

    return {
      ...this.state,
      data,
      header
    }
  }
}

export default RequestForm
