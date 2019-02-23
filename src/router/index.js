import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';
// import Login from '../components/login.vue'
// webpack项目模板 提供@ -> 自动找到src文件夹
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users'
import Rights from '@/components/rights'
import Roles from '@/components/roles'

Vue.use(Router)

const router = new Router({
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
    // 当标识是login时 ->让下面的配置生效
    // 在配置生效前,处理路由标识看是不是login
    name: 'login',
    path: '/login',
    component: Login
  }]
})

// 在路由.js中

// 路由的导航守卫(保安)
// 在路由配置生效前,代码自动来到下面位置
// to 要去的路由配置对象
// from 当前的路由配置对象
router.beforeEach((to, from, next) => {
  console.log('路由守卫执行---');
  // ...
  // console.log(to,from);

  // 如果要去的是登录 -> 继续登录
  if(to.name==='login'){
    next();
  }else{
    // 如果要去的不是登录 ->
    const token = localStorage.getItem("token");
    //  if token -> 渲染login
    if(!token){
      // this.$message.warning('请先登录');  // js代码不这样写
      // alert("")
      Message.warning("请先登录");
      router.push({
        name:'login'
    })
    return;     // 与else{}相同
  }
    //  if token 渲染home
    next()
  }

  // next方法:让路由配置继续生效
  // next();
})
export default router;