import React from 'react'
import {
  Button,
  Form,
  Input,
  InputNumber
} from 'antd'

const { Item } = Form

class GiftForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      sendNick: '',
      itemName: '',
      minSendItemCount: 0,
      minSendItemComboHits: 0
    }
  }
  render () {
    return (
      <Form>
        <Item>
          <Button block onClick={() => this.props.leadGift()}>引导送礼</Button>
          <Button block onClick={() => this.props.onGiftSubmit()}>监听当前用户送礼消息</Button>
        </Item>
        <Item label='送礼者昵称'>
          <Input onChange={evt => this.setState({ sendNick: evt.target.value })} />
        </Item>
        <Item label='礼物名字'>
          <Input onChange={evt => this.setState({ itemName: evt.target.value })} />
        </Item>
        <Item label='最小礼物数量'>
          <InputNumber onChange={value => this.setState({ minSendItemCount: value })} defaultValue={0} />
        </Item>
        <Item label='最小连击数'>
          <InputNumber onChange={value => this.setState({ minSendItemComboHits: value })} defaultValue={0} />
        </Item>
        <Item>
          <Button style={{ marginRight: '16px' }} onClick={() => this.props.onGiftChange({ ...this.state })}>监听当前直播间送礼消息</Button>
          <Button onClick={() => this.props.offGiftChange()}>取消监听</Button>
        </Item>
        <Item>
          <Button block onClick={() => this.props.getGiftConf()}>获取礼物配置</Button>
        </Item>
        <Item label='礼物ID'>
          <Input onChange={evt => this.setState({ giftId: evt.target.value })} />
        </Item>
        <Item label='礼物个数'>
          <InputNumber onChange={value => this.setState({ giftCount: value })} />
        </Item>
        <Item>
          <Button block onClick={() => this.props.sendGift({
            giftId: this.state.giftId,
            giftCount: this.state.giftCount
          })}>赠送礼物</Button>
        </Item>
      </Form>
    )
  }
}

export default GiftForm
