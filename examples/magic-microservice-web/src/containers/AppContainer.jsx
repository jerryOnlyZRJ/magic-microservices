import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import Store from '@/models'

// i18n
// import { ConfigProvider } from 'byted-antx';
// import { getLang } from '@byted-cg/cg-i18n-utils';
// import fetchAPI from 'fetch';
// redux
import routes from '@/routes'
import CoreLayout from '../layouts/CoreLayout'

// Use store
const Provider = Store.createProvider()

const AppContainer = () => (
  <Provider>
    <BrowserRouter>
      <CoreLayout>
        <div>{renderRoutes(routes)}</div>
      </CoreLayout>
    </BrowserRouter>
  </Provider>
)

export default AppContainer
