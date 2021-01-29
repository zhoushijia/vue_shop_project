import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, MenuItem, Submenu, MenuItemGroup } from 'element-ui'

// 挂载组件使用Vue.use()
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)

// 挂载方法或者属性通过prototype
// 挂载 弹框组件
Vue.prototype.$message = Message
