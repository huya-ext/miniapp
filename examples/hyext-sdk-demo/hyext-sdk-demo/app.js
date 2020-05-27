/* eslint-disable react/no-direct-mutation-state */
import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './app.hycss'
import { components } from './config.js'
import { Router, Route } from '../common/Route'

import WhiteBoard from '../common/WhiteBoard'

const { Button, View, Text, ScrollView, NavigationBar } = UI

class Home extends Component {
  renderItem () {
    const { props } = this
    return components.map((item, i) => {
      return (
        <Button className='com-list-item' onPress={() => { props.onNavClick(item.name) }} key={i}>
          <Text className='item-text' style={{ color: '#000' }} numberOfLines={1}>{item.name}</Text>
        </Button>
      )
    })
  }

  render () {
    return (
      <View>
        <Text className='list-title' style={{ color: '#000' }}>组件列表</Text>
        <View className='com-list'>
          {this.renderItem()}
        </View>
      </View>
    )
  }
}

function ComponentDemo ({ name, onBack }) {
  let Com = () => null
  const config = components.find((c) => {
    return c.name === name
  })

  if (config) {
    Com = config.component
  }

  return (
    <View>
      <NavigationBar
        title={name}
        onPressBack={() => {
          onBack && onBack()
        }}
        backLabelText='返回'
      />
      <Com />
    </View>
  )
}

ComponentDemo.propTypes = {
  name: PropTypes.string,
  onBack: PropTypes.func
}

class App extends Component {
  constructor () {
    super()

    this.init()
  }

  componentDidMount () {
    this._mounted = true

    if (typeof global.hyExt.env.getInitialParam === 'function') {
      global.hyExt.env.getInitialParam().then(param => {
        if (param.wb) {
          if (this._mounted) {
            this.setState({
              path: '/wb'
            })
          }
        }
      })
    }
  }

  componentWillUnmount () {
    this._mounted = false
  }

  init () {
    if (global.__os === 'web') {
      const search = window.location.search
      const componentName = search.split('=')[1]
      this.state = {
        path: componentName ? '/component' : '/home',
        componentName: componentName
      }
    } else {
      this.state = { path: '/home', componentName: '' }
    }

    global.hyExt.observer.on('show', () => {
      global.hyExt.panel.setLayout({
        visible: true,
        x: 0.1,
        y: 0.1,
        width: 0.8,
        height: 0.8,
        ref: 'player',
        alpha: 1
      }).catch(_ => {})
    })
    global.hyExt.context.on('extActivated', () => {
      global.hyExt.panel.setLayout({
        visible: true,
        x: 0.1,
        y: 0.1,
        width: 0.8,
        height: 0.8,
        ref: 'player',
        alpha: 1
      }).catch(_ => {})
    })
  }

  handleBack () {
    this.setState({
      path: '/home',
      componentName: ''
    })
  }

  handleNavClick (name) {
    this.setState({
      path: '/component',
      componentName: name
    })
  }

  render () {
    const {
      path,
      componentName
    } = this.state

    const contentContainerStyle = path === '/wb' ? { flex: 1 } : {}

    return (
      <ScrollView className='container' contentContainerStyle={contentContainerStyle}>
        <Router currPath={path}>
          <Route path='/home' component={() => <Home onNavClick={this.handleNavClick.bind(this)} />} />
          <Route path='/component' component={() => <ComponentDemo onBack={this.handleBack.bind(this)} name={componentName} />} />
          <Route path='/wb' component={() => <WhiteBoard />} />
        </Router>
      </ScrollView>
    )
  }
}

export default App
