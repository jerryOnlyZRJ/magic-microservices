/**
 * 定义整个项目的全局配置
 */
const {
  _EMPLOYEE_: { employeeName, employeeId, employeeMail },
} = window

export default {
  name: '[% name %]', // 项目的名字
  subName: '', // 项目的名字
  favicon: '/favicon.ico', // 设置网页的favicon, 可以是外链, 也可以是本地
  menuTheme: 'dark', // 设置左侧菜单风格
  baseRoute: '/',
  footer: '', // footer中显示的字, 可以嵌入html标签

  baseConf: {
    user: {
      name: employeeName,
      id: employeeId,
      mail: employeeMail,
    },
  },
}
