import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 按需导入 element ui 组件
import './plugins/element.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
