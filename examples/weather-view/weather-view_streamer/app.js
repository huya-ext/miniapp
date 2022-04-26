import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './app.hycss'

const { View, Text } = UI

class App extends Component {
  render () {
    return (
      <View className="container"><Text>hello world</Text></View>
    )
  }
}

export default App
