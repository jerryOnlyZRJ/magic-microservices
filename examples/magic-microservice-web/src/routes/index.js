// We only need to import the modules necessary for initial render
import AsyncLoad from '@/components/AsyncLoad'

export default [
  {
    name: '首页',
    path: '/',
    exact: true,
    component: AsyncLoad(() => import(/* webpackChunkName: "Home" */ '@/pages/Home')),
  },
  {
    component: AsyncLoad(() => import(/* webpackChunkName: "NotFound" */ '@/pages/NotFound')),
  },
]
