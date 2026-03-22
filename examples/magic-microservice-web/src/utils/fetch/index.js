import fetch, { pureFetch } from './fetch'
import _ from 'lodash'
import querystring from 'querystring'
import { getLang } from '@byted-cg/cg-i18n-utils'
import utils from '@/utils'
import { SUCCEED } from '@/constant'

const { getSession, setSession, getLocalStorage, setLocalStorage, getMemoryStorage, setMemoryStorage } = utils

const getBodyStr = obj => {
  return Object.entries(obj)
    .sort()
    .map(item => item.join('-'))
    .join('#')
}

const getCacheKey = (url, body) => {
  return url + getBodyStr(body)
}

const useSession = { get: getSession, set: setSession }
const useLocal = { get: getLocalStorage, set: setLocalStorage }
const useMemory = { get: getMemoryStorage, set: setMemoryStorage }
const cacheMap = {
  s: useSession,
  session: useSession,
  l: useLocal,
  local: useLocal,
  m: useMemory,
  memory: useMemory,
}

const fetchAPIProducer = _fetch => (api, _body, params = {}) => {
  const body = { ..._body }
  let { url, method, useCache, cacheType: defaultCacheType = 's' } = api
  const { cacheType = defaultCacheType, expired = 3600 * 24 * 30, multipartFormData = false } = params

  let cacheKey // 缓存key
  let storage // 缓存方法
  let config = {
    headers: {
      // 国际化多语言支持
      'Accept-Language': getLang(),
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'include',
    method,
  }
  if (_.isFunction(url)) {
    const { $dept } = body
    url = url($dept)
    delete body.$dept
  }
  if (body && body.$rest) {
    url = url + `/${body.$rest}`
    delete body.$rest
  }
  if (method === 'GET') {
    if (useCache) {
      cacheKey = typeof api.useCache === 'string' ? api.useCache : getCacheKey(url, body)
      storage = cacheMap[cacheType]
      if (!storage) {
        console.error('缓存关键字cacheType未正确设置，将采用sessionStorage!')
        storage = useSession
      }
      const cacheData = storage.get(cacheKey, expired)
      if (cacheData || cacheData === false) {
        // 后端数据可能会是 data: false 太恶心了
        return Promise.resolve({ code: SUCCEED, data: cacheData })
      }
    }
    if (body) {
      if (!_.isEmpty(body)) {
        let params = _.isPlainObject(body) ? querystring.stringify(body) : body
        url = url + `?${params}`
      }
    }
  } else {
    if (multipartFormData) {
      const formData = new FormData()
      for (let name in body) {
        let value = _.isPlainObject(body[name]) ? JSON.stringify(body[name]) : body[name]
        formData.append(name, value)
      }
      config.body = formData
    } else {
      config.headers['Content-Type'] = 'application/json'
      config.body = JSON.stringify(body)
    }
  }
  return _fetch.request(url, config, { cacheKey, storage, expired })
}

// 兼容并发多个请求
const fetchMutipleAPIWrapper = fn => (params, ...args) => {
  if (params instanceof Array) {
    const apiParams = [params, ...args]
    const task = apiParams.map(param => fn(...param))
    return Promise.all(task)
  } else {
    return fn(params, ...args)
  }
}

// 不处理业务错误
export const fetchPureAPI = fetchMutipleAPIWrapper(fetchAPIProducer(pureFetch))

// 处理业务错误
export default fetchMutipleAPIWrapper(fetchAPIProducer(fetch))
