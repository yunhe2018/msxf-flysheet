import axios from 'axios'
import consts from '../util/constant.js'
import router from '../router'
import store from '../store'
import { showLoading, hideLoading } from './loading'

// axios.defaults.withCredentials = true
axios.defaults.baseURL = consts.apiPrefix

function axioInterceptor (instance) {
  // http request 拦截器
  instance.interceptors.request.use(
    config => {
      if (!/\/(dataExport|dashBoard|picture)$/.test(config.url)) {
        showLoading()
      }
      if (/get/i.test(config.method)) {
        config.params = config.params || {}
        config.params._t = Date.parse(new Date()) / 1000
      }

      const sessionId = store.state.sessionId
      if (sessionId) {
        config.headers.sessionId = sessionId
      }
      return config
    },
    err => {
      hideLoading()
      return Promise.reject(err)
    }
  )
  // http response 拦截器
  instance.interceptors.response.use(
    response => {
      // console.log(response.headers['content-disposition'].split(';')[1].split('=')[1])
      // console.log(response.headers['content-disposition'])
      if (!/\/(dataExport|dashBoard|picture)$/.test(response.config.url)) {
        hideLoading()
      }
      if (response.data.code === '1001') {
        // 只有在当前路由不是登录页面才跳转
        if (!/login/.test(router.currentRoute.path)) {
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.path }
          })
          // response.data.message = '登录失效'
          return Promise.reject(response)
        }
      }
      return response
    },
    error => {
      hideLoading()
      console.log(error)
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 401 清除token信息并跳转到登录页面
          //   store.commit(types.LOGOUT)
            // 只有在当前路由不是登录页面才跳转
            if (!/login/.test(router.currentRoute.path)) {
              router.replace({
                path: 'overtime',
                query: { redirect: router.currentRoute.path }
              })
            }
        }
      }
      return Promise.reject(error)
    }
  )
}
export const service = axios.create({
  timeout: 10000
})
export const downloadService = axios.create({})
axioInterceptor(downloadService)
axioInterceptor(service)
