import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Router extends Component {
  static defaultProps = {
    currPath: ''
  }

  static propTypes = {
    currPath: PropTypes.string,
    children: PropTypes.node
  }

  render () {
    const {children, currPath} = this.props
    let target = null

    React.Children.forEach(children, item => {
      if (item.props.path === currPath) {
        target = item
      }
    })

    if (target) {
      const Com = target.props.component
      return <Com></Com>
    }

    return null
  }
}

export function Route (props) {
  return null
}

Route.defaultProps = {
  path: '',
  component: ''
}
