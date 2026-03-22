import React from 'react'
import { Layout, ConfigProvider } from '@byte-design/ui'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { getLang } from '@byted-cg/cg-i18n-utils'
import HeaderCustom from './components/Header'
import SiderCustom from './components/Sider'

import fetchAPI from 'fetch'

import globalConfig from '@/config'
import './index.less'

const { Content } = Layout

const {
  baseConf: { user },
} = globalConfig
const CoreLayout = ({ children }) => {
  const { pathname } = window.location

  return (
    <ConfigProvider localeCode={getLang()} fetchMethod={({ method, url, data }) => fetchAPI({ method, url }, data)}>
      <Layout>
        <HeaderCustom user={user} />
        <Layout hasAside>
          <SiderCustom path={pathname} />
          <Content styleName="customContent">
            <div styleName="layoutContainer">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.any,
}
export default withRouter(CoreLayout)
