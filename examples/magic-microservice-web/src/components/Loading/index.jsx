import React from 'react'
import PropTypes from 'prop-types'
import './index.less'

const Loading = props => {
  const { className = '', hide = false } = props
  return (
    <div className={`loading__wrap ${className}`} data-hide={hide}>
      <div className="loading">
        <div className="pulse" />
      </div>
    </div>
  )
}

Loading.propTypes = {
  className: PropTypes.string,
  hide: PropTypes.bool,
}

export default Loading
