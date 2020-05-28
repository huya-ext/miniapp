import React, { Component } from 'react'
import { UI } from '@hyext/hy-ui'

import styles from '../styles'

const { View, Text } = UI

export default class LogPanel extends Component {
  constructor (props) {
    super(props)

    this.state = { logs: [] }
  }
  render () {
    let { logs } = this.state
    return (
      <View>
        <Text style={styles.header}>日志</Text>
        <View style={{
          paddingHorizontal: 20
        }}>
          {
            logs.length
              ? (logs || []).map(({ time, msg }, index) => (
                <Text key={index} style={{ wordBreak: 'break-all', paddingVertical: 5, color: '#000' }} numberOfLines={0}>
                  【{time.toLocaleTimeString()}】{msg}
                </Text>
              ))
              : <Text numberOfLines={0} style={{ paddingVertical: 5, color: '#000' }}>暂时没有日志</Text>
          }
        </View>
      </View>
    )
  }
  log (msg) {
    this.setState({
      logs: [
        ...this.state.logs.slice(Math.max(0, this.state.logs.length - 4)), {
          time: new Date(),
          msg
        }
      ]
    })
  }
}
