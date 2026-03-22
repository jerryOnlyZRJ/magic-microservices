import React from 'react'
import PropTypes from 'prop-types'
import img404 from './404.png'
import cloud404 from './cloud_404.png'

import './index.less'

export const NotFound = props => {
  return (
    <div style={{ background: '#f6f6f6', marginTop: '-20px' }}>
      <div styleName="wscn-http404">
        <div styleName="pic-404">
          <img styleName="pic-404__parent" src={img404} alt="404" />
          <img styleName="pic-404__child" src={cloud404} alt="404" />
          <img styleName="pic-404__child" src={cloud404} alt="404" />
          <img styleName="pic-404__child" src={cloud404} alt="404" />
        </div>
        <div styleName="text">
          <div styleName="text__oops">当前页面无法访问！</div>
          <div styleName="text__headline">404 Not Found</div>
          <div styleName="text__info">请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</div>
          <a
            styleName="text__return-home"
            onClick={e => {
              e.preventDefault()
              return props.history.goBack()
            }}
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  )
}

NotFound.propTypes = {
  history: PropTypes.object,
}

export default NotFound
