import Vue from 'vue'
import VueRouter from 'vue-router'
import hub from '../utils/hub.js'

// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')

// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')

// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')

// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')

// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Cateparams" */ '../components/goods/Cate.vue')

// import Cateparams from '../components/goods/Cateparams.vue'
const Cateparams = () => import(/* webpackChunkName: "Cate_Cateparams" */ '../components/goods/Cateparams.vue')

// import Goodslist from '../components/goods/Goodslist.vue'
const Goodslist = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Goodslist.vue')

// import Addgood from '../components/goods/Addgood.vue'
const Addgood = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Addgood.vue')

// import Orders from '../components/orders/Orders.vue'
const Orders = () => import(/* webpackChunkName: "Orders_Report" */ '../components/orders/Orders.vue')

// import Report from '../components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "Orders_Report" */ '../components/report/Report.vue')

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
      { path: '/params', component: Cateparams },
      { path: '/goods', component: Goodslist },
      { path: '/goods/add', component: Addgood },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Report }
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
