import { prefix } from './base.api'

export default {
  // 团队看板-数据概览
  getDashboardRecent: {
    url: `${prefix}/team/recent/summary/`,
    method: 'GET',
  },

  // 团队看板-code趋势
  getRecentCodeTrend: {
    url: `${prefix}/team/recent/code/trend/`,
    method: 'GET',
  },

  // 团队看板-bug趋势
  getRecentBugTrend: {
    url: `${prefix}/team/recent/bug/trend/`,
    method: 'GET',
  },

  // 团队看板-项目数据
  getRecentGroupQuality: {
    url: `${prefix}/team/recent/group/quality/`,
    method: 'GET',
  },

  // 团队看板-团队列表
  getRecentGroupList: {
    url: `${prefix}/team/group/`,
    method: 'GET',
  },
}
