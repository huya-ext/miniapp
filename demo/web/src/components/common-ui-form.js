import React from 'react'
import {
  List,
  Input,
  Button
} from 'antd'

const { Item } = List

class CommonUIForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = { msg: '' }
  }
  render () {
    return (
      <List>
        <Item>
          <Button block onClick={() => this.props.showActivityBadge()}>显示互动通道红点</Button>
        </Item>
        <Item>
          <Input onChange={evt => this.setState({ msg: evt.target.value })} placeholder='Toast内容' style={{ marginBottom: '16px' }} />
          <Button block onClick={() => this.props.showToast(this.state.msg)}>显示Toast</Button>
        </Item>
      </List>
    )
  }
}

export default CommonUIForm
