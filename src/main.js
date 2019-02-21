// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import App from './App'
import CusBread from './components/cusBread.vue'
import router from './router'
import moment from 'moment'
import HttpServer from './components/http'


// Vue.use(axios)

// ElementUI其实是Vue插件，和VueRouter用法一样  Vue.use(名)
// Vue插件的使用
// 下载element后，引入
Vue.use(ElementUI)
Vue.use(HttpServer)  // axios封装插件后使用

Vue.config.productionTip = false

// 全局过滤器  - 处理日期
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 全局的自定义组件
// cusBread：可以这样起名字，但是不合理
Vue.component(CusBread.name, CusBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
