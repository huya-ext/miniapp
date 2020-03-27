import React, { Component } from 'react'
import { UI } from '@hyext/hy-ui'

const { View, Button } = UI

export default class SubmitButton extends Component {
  render () {
    let { onPress, children } = this.props
    return (
      <View style={{ flexDirection: 'row', marginTop: 20, paddingHorizontal: 20, marginBottom: 40 }}>
        <View style={{ flex: 1 }}>
          <Button
            textColorInverse
            type='primary'
            onPress={onPress}>
            {children}
          </Button>
        </View>
      </View>
    )
  }
}
