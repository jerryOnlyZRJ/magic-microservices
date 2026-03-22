import React, { useCallback, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Layout, Menu } from '@byte-design/ui'
import { DoubleLeft, DoubleRight } from '@byte-design/icons'
import { Link } from 'react-router-dom'

import routes from '@/routes'

import './index.less'

const { Aside } = Layout

const SiderCustom = ({ path }) => {
  const [selectedKeys, setSelectedKeys] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [menus] = useState(
    routes
      .filter(route => !!route.path)
      .map(({ name, path, routes }) => ({ name: name || path, code: path, pathName: path, children: routes })),
  )
  const filterMenuData = useCallback(
    menus => {
      const menuList = []
      menus.forEach(item => {
        const baseData = {
          ...item,
        }
        let menuData = {
          ...baseData,
        }
        if (item.children && item.children.length) {
          _.assign(menuData, {
            children: item.children.map(child => {
              return filterMenuData([child])[0]
            }),
          })
        }
        menuList.push(menuData)
      })
      return menuList
    },
    [menus],
  )
  const getDefaultOpenKeys = useCallback(
    path => {
      const pathSplit = path === '/' ? [] : path.split('/')
      const [defaultOpenKeys] = pathSplit
      const temp = filterMenuData(menus)
      const defaultSelectedGroup = temp.filter(item => item.pathName.indexOf(path) !== -1)
      const defaultSelectedKeys = defaultSelectedGroup.length ? _.get(defaultSelectedGroup, '0.code') : ''
      return {
        defaultOpenKeys: 'ocrm_fe.customer.' + defaultOpenKeys || 'index',
        defaultSelectedKeys: defaultSelectedKeys,
      }
    },
    [menus],
  )
  const transFormMenuItem = useCallback(subItem => {
    if (subItem) {
      if (subItem.children && subItem.children.length > 0) {
        return subItem.children.map(item => {
          const { pathName, code, name } = item
          return (
            <Menu.Item id={code} key={code} data-id={code}>
              <Link to={`${pathName}`} style={{ display: 'inline' }}>
                <span className="nav-text">{name}</span>
              </Link>
            </Menu.Item>
          )
        })
      } else {
        const { pathName, code, name } = subItem
        return (
          <Menu.Item id={code} key={code} data-id={code}>
            <Link to={`${pathName}`} style={{ display: 'inline' }}>
              <span className="nav-text">{name}</span>
            </Link>
          </Menu.Item>
        )
      }
    }
    return []
  }, [])
  const renderMenuItems = useMemo(() => {
    const useMenus = filterMenuData(menus)
    let menu = null
    if (useMenus.length > 0) {
      menu = useMenus.map(subItem => {
        const subMenu =
          subItem.children && subItem.children.length > 0 ? (
            <Menu.SubMenu key={subItem.code} data-id={subItem.code} title={subItem.name}>
              {transFormMenuItem(subItem)}
            </Menu.SubMenu>
          ) : (
            transFormMenuItem(subItem)
          )
        return subMenu
      })
    }
    return menu
  }, [menus])
  const handlerSelect = useCallback(
    menu => {
      setSelectedKeys(menu.code)
    },
    [selectedKeys],
  )
  const defaultSelectedKeys = getDefaultOpenKeys(path).defaultSelectedKeys

  return (
    <Aside styleName="slider" style={{ maxWidth: collapsed ? 0 : 200 }}>
      <Menu className="menu-list" onClick={handlerSelect} activeId={selectedKeys || defaultSelectedKeys}>
        {renderMenuItems}
      </Menu>
      <div styleName="fold">
        <div className="toggle">
          <span className="circle" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <DoubleRight /> : <DoubleLeft />}
          </span>
        </div>
      </div>
    </Aside>
  )
}

SiderCustom.propTypes = {
  path: PropTypes.string.isRequired,
}

export default SiderCustom
