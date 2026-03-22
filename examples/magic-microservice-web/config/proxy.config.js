const domain = 'https://yapi.bytedance.net/mock/3086'
const proxy = {
  '/back_end': {
    target: domain,
    changeOrigin: true,
    secure: true,
  },
}

module.exports = proxy
