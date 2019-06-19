
import React from 'react'
import { render } from 'react-dom'
import classnames from 'classnames'
import Avatar from './components/Avatar'
import HyExtDev from './hy-ext-dev'
import 'antd/dist/antd.css'

let isDemo = true;

render(
  <HyExtDev />,
  document.getElementById('root')
)
