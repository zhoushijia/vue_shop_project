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
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
