import React, { useCallback, useMemo, useState } from 'react'
import { Dropdown } from '@byte-design/ui'
import { Earth } from '@byte-design/icons'
import { setLang, getLang } from '@byted-cg/cg-i18n-utils'

import './index.less'

const GlobalPop = () => {
  const [langList] = useState([
    {
      code: 'zh',
      label: '中文(简体)',
    },
    {
      code: 'en',
      label: '英文',
    },
    {
      code: 'ja',
      label: '日文',
    },
  ])
  const handleChangeI18n = useCallback(({ key }) => {
    setLang(key)
    location.reload()
  }, [])
  const langCookie = getLang()
  const lang = langCookie === 'undefined' ? 'zh' : 'langCookie'

  const DropMenu = useMemo(() => {
    return (
      <Dropdown.Menu activeId={lang} onClick={handleChangeI18n}>
        <div styleName="lang-tag">语言</div>
        {langList.map(lang => (
          <Dropdown.MenuItem id={lang.code}>{lang.label}</Dropdown.MenuItem>
        ))}
      </Dropdown.Menu>
    )
  }, [langList])
  return (
    <Dropdown placement="bottom-end" menu={DropMenu}>
      <Earth />
    </Dropdown>
  )
}

export default GlobalPop
