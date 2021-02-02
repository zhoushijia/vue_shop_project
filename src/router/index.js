import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import hub from '../utils/hub.js'
import Cate from '../components/goods/Cate.vue'
import Cateparams from '../components/goods/Cateparams.vue'

// 注册路由分支
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Cateparams }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果是到login页面,直接跳转
  if (to.path === '/login') return next()
  // 否则,获得 token 值 判断 token 是否正确
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token值或者不正确 跳转到token页面
  if (!tokenStr) return next('/login')
  // 调用后端 核验 token 是否正确
  hub.$emit('getActivePath', to.path)
  next()
})

export default router
