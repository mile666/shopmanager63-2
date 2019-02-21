import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login.vue'
// webpack项目模板 提供@ -> 自动找到src文件夹
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users'
import Rights from '@/components/rights'
import Roles from '@/components/roles'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: Users
    }, {
      name: 'rights',
      path: '/rights',
      component: Rights
    },{
      name: 'roles',
      path: '/roles',
      component: Roles
    }]
  }, {
    name: 'login',
    path: '/login',
    component: Login
  }]
})
