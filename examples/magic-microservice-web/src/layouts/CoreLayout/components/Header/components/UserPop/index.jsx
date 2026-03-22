import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from '@byte-design/ui'
import _ from 'lodash'
import './index.less'

const UserPop = ({ user }) => {
  return (
    <div>
      <Avatar
        styleName="use-pop"
        id="user-avatar"
        icon="user"
        src={`https://ee.bytedance.net/ratak/employees/${_.get(user, 'id')}/avatar/?format=noop.png`}
      />
    </div>
  )
}
UserPop.propTypes = {
  user: PropTypes.object,
}
export default UserPop
