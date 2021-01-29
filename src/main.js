import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 按需导入 element ui 组件
import './plugins/element.js'
// 导入自定义全局样式
import './assets/css/global.css'
// 导入字体图标样式
import './assets/fonts/iconfont.css'
// 导入 axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器 添加令牌
axios.interceptors.request.use((config) => {
  // 请求头添加 Authorization
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器 拦截无效token
axios.interceptors.response.use((res) => {
  if (res.data.meta.msg === '无效的token' && res.data.meta.status === 400) {
    window.sessionStorage.clear()
    // 原生的 hash 地址
    location.href = '/#/login'
  }
  return res
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
