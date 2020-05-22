import React, { Component } from 'react'
import { UI } from '@hyext/hy-ui'

const { Form } = UI

export default class FormItem extends Component {
  render () {
    let { label, children } = this.props
    return (
      <Form.Item
        style={{ paddingVertical: 13 }}
        label={label}>
        {children}
      </Form.Item>
    )
  }
}
