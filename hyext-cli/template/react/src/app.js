
import React from 'react'
import { render } from 'react-dom'
import classnames from 'classnames'
import Avatar from './components/Avatar'
import './assets/scss/common.scss'

let isDemo = true;

render(
  <div className={classnames({'demo': isDemo})}>
  	<Avatar/>
  	<h1>Welcome to Your React.js Ext App</h1>
  </div>,
  document.getElementById('root')
)
