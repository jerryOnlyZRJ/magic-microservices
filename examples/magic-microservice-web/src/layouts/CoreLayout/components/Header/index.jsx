import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Divider } from '@byte-design/ui'
import Logo from './components/Logo'
import UserPop from './components/UserPop'
import GlobalPop from './components/GlobalPop'

import './index.less'
const { Header } = Layout

const HeaderCustom = ({ style, user }) => {
  return (
    <Header styleName="header" style={style}>
      <div>
        <Logo />
      </div>
      <div styleName="ft">
        <GlobalPop />
        <Divider style={{ margin: '0 16px' }} type="vertical" />
        <UserPop user={user} />
      </div>
    </Header>
  )
}

HeaderCustom.propTypes = {
  style: PropTypes.object,
  user: PropTypes.object,
}
export default HeaderCustom
