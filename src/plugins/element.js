import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 挂载组件使用Vue.use()
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 挂载方法或者属性通过prototype
// 挂载 弹框组件
Vue.prototype.$message = Message
