import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import TOOL from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: window.CONFIG.base_api, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000, // request timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['z-token'] = getToken()
    }
    if (!window.CONFIG.base_api) {
      if (config.url.match('tree')) {
        config.url = '/tree/list'
      } else if (!config.url.match('token')) {
        config.url = '/table/list'
      }
    }

    // console.log(config)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log(response)

    const res = response.data
    if (response.status > 300) {
      TOOL.message('error', '请求失败')
      return Promise.reject(new Error('请求失败'))
    } else {
      if (res) {
        return res
      } else {
        return true;
        // return Promise.reject(new Error('Error'))
      }
    }
  },
  error => {
    console.log(error.response)
    const status = error.response?error.response.status:null;
    if(status){
      switch (status) {
        case 401:
          TOOL.message('warning', '登陆过期，即将返回登陆页面')
          setTimeout(() => {
            store.dispatch('user/logout').then(() => {
              location.reload()
            })
          }, 1500)
          break;
        case 500:
          TOOL.message('warning', "服务器错误，请稍后再试")
          break;
        case 404:
          console.log(error.response.data || status)
          break;
        default:
          let msg=error.response.data;
          if(error.response.config.responseType==='blob'){
            let reader = new FileReader()
            reader.onload = e => {
              TOOL.message('warning', e.target.result || status)
            }
            reader.readAsText(msg)
          }else{
            if(error.response.data.constructor === Array&&error.response.data.length){
              msg=error.response.data[0].message
            }
            TOOL.message('warning', msg || status)
          }
          break;
      }
    }
    return Promise.reject(error)
  }
)

export default service
