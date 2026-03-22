import React from 'react'
import MMMLogo from '@/assets/images/logo.png'
import './index.less'

/**
 * 定义Logo组件
 */
class Logo extends React.PureComponent {
  render() {
    return (
      <div>
        <a href="/" style={{ display: 'block' }}>
          <img alt style={{ verticalAlign: 'middle' }} width="98" height="29" src={MMMLogo} />
        </a>
      </div>
    )
  }
}

export default Logo
