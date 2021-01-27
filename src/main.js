import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 按需导入 element ui 组件
import './plugins/element.js'
// 导入自定义全局样式
import './assets/css/global.css'
// 导入字体图标样式
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
