export const prefix = '/back_end'

export default {
  test: {
    url: `${prefix}/test`,
    method: 'GET',
  },

  getEmployeeMenus: {
    url: `${prefix}/employee/menus`,
    method: 'GET',
  },

  getEmployeeSubordinate: {
    url: `${prefix}/employee/subordinate/`,
    method: 'GET',
  },

  getEmployeeSearch: {
    url: `${prefix}/employee/search/`,
    method: 'GET',
  },

  getDeapartment: {
    url: `${prefix}/department/sub_department/`,
    method: 'GET',
  },

  getUpdateTime: {
    url: `${prefix}/update_time`,
    method: 'GET',
  },
}
