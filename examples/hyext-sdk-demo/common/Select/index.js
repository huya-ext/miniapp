import React, { Component } from 'react'
import { UI } from '@hyext/hy-ui'

const { View, Button, Text, Actionsheet } = UI

export default class Select extends Component {
  render () {
    let { data, header, value, onPressConfirm } = this.props
    return (
      <View>
        <Button onPress={() => {
          this.actionsheet.open()
        }}>
          <Text>{value}</Text>
        </Button>
        <Actionsheet
          ref={(c) => {
            this.actionsheet = c
          }}
          header={header}
          data={data}
          onPressConfirm={onPressConfirm}
        />
      </View>
    )
  }
}
