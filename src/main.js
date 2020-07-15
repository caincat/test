import api from './api'
import util from './utils'

import Vue from 'vue'

import './plugins'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import store from './store'


import '@/permission' // permission control
import "@/components"; //导入全局组件

Vue.config.productionTip = false


//如果没有后台地址，则启动Mock制造假数据
if (!window.CONFIG.base_api) {
  require("../mock")
}

Vue.prototype.API = api;

Vue.prototype.TOOL = util;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
