import 'isomorphic-fetch'
import { message } from '@byte-design/ui'
import { SUCCEED } from '@/constant'

const fetch = window.fetch

/**
 * 检查接口响应状态码
 *
 * @param {T} response fetch返回的响应对象
 * @return {Promise<T>} 状态码正常时返回响应本身，否则返回 reject 信息
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    const message = getErrorMsgByStatusCode(response.msg, response.status)
    return Promise.reject({ message, response })
  }
}

/**
 * 返回状态码对应文本提示信息
 *
 * @param {number} code 响应状态码
 * @return {string} 文本提示
 */
function getErrorMsgByStatusCode(msg, code) {
  let result = '未知错误'
  if (code >= 400 && code < 500) {
    switch (code) {
      case 401:
        result = msg || '您尚未登录,请登录后访问.'
        break
      case 403:
        result = msg || '您所请求的资源被禁止访问.'
        break
      case 404:
        result = msg || '您所请求的资源并不存在.'
        break
      case 405:
        result = msg || '非法请求被禁止.'
        break
      case 406:
        result = msg || '参数错误.'
        break
      default:
        result = `${'抱歉，程序出了问题'}(${code}).`
    }
  } else if (code >= 500 && code < 600) {
    result = msg || '服务器出错啦.'
  }
  return result
}

/**
 * 异常处理函数，包含错误提示
 *
 * @param {Object} e 错误信息
 */
function handleError(e) {
  if (!e.response) {
    // 断网情况
    e.message = navigator && navigator.onLine ? '网络异常' : '网络中断'
    message.error(e.message)
  } else {
    message.error(e.message)
  }
  throw e
}

/**
 * 服务端返回响应值
 * @param {Object} res response的响应信息
 */
function jsonParse(res) {
  return res
    .json()
    .then(jsonResult => jsonResult)
    .catch(err => {
      const error = new Error(err.message)
      message.error('json 解析错误')
      Promise.reject(error)
    })
}

// 校验接口code 是否正确
const checkCode = cacheConfig => response => {
  const { cacheKey, storage, expired } = cacheConfig
  if (response.code === SUCCEED || response.success) {
    if (cacheKey) {
      storage.set(cacheKey, response.data, expired)
    }
    return Promise.resolve(response)
  } else {
    return Promise.reject(response)
  }
}

export const pureFetch = {
  request: (url, config, cacheConfig) => {
    return fetch(url, config)
      .then(checkStatus)
      .then(rps => rps.json())
      .then(checkCode(cacheConfig))
  },
}

export default {
  request: (url, config, cacheConfig) => {
    return fetch(url, config)
      .then(checkStatus)
      .then(jsonParse)
      .then(checkCode(cacheConfig))
      .catch(handleError)
  },
}
