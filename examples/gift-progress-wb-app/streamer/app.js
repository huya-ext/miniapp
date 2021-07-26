import React, { Component } from 'react'

import Panel from './Panel'
import Wb from './Wb'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      path: ''
    }
  }

  componentDidMount () {
    global.hyExt.env.getInitialParam().then(param => {
      this.setState({
        path: param.wb ? 'wb' : ''
      })
    })
  }

  render () {
    const { path } = this.state
    if (path === '') {
      return <Panel />
    } else if (path === 'wb') {
      return <Wb />
    }
  }
}

export default App
