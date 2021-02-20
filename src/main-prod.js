import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 按需导入 element ui 组件
// 导入自定义全局样式
import './assets/css/global.css'
// 导入字体图标样式
import './assets/fonts/iconfont.css'
// 导入 axios
import axios from 'axios'
// 导入 vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('zk-table', ZkTable)
// 导入富文本 插件
import VueQuillEditor from 'vue-quill-editor' //调用编辑器

// 优化
// #1 进度条
import NProgress from 'nprogress'

Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器 添加令牌
axios.interceptors.request.use((config) => {
  // 请求前 进度条开始
  NProgress.start()
  // 请求头添加 Authorization
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器 拦截无效token
axios.interceptors.response.use((res) => {
  // 请求完成时 进度条结束
  NProgress.done()
  if (res.data.meta.msg === '无效token' && res.data.meta.status === 400) {
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
