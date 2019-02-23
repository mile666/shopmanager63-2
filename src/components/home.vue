<template>
  <el-container class="container">
    <el-header>
      <!-- el-row 一行  el-col 一列  份数24份 -->
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="图片加载失败">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <div class="grid-content bg-purple">
            <a href="#" @click.prevent= "handleLoginout()" class="loginout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 导航 -->
        <!-- router->开启路由模式，点击对应的导航，当前的path就是激活导航的index值 -->
        <el-menu default-active="1" :router="true" :unique-opened="true">
          <!-- 用户管理 -->
          <el-submenu :index="item1.order+''" v-for="(item1,i) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <!-- 
              1.<router-link></router-link> 改标识
              2.提供容器
              3.提供组件 users.vue
              4.newVueRouter()
              5.配置
              6.挂载
             -->
            <el-menu-item :index="item2.path+''" v-for="(item2,i) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
               {{item2.authName}}
            </el-menu-item>
          </el-submenu>
        
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!-- 提供容器 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      menus:[]
    }
  },
  // 如果用户没有登录，/标识匹配到时， 不能进入home.vue
  // if(有没有正确的token){渲染home.vue}
  // if(没有token){改login，显示login}
  // 代码位置 -> 在渲染home.vue之前 home.vue渲染完毕时 -> mounted()
  // 组件在渲染完成之前先来到 beforemount（）{}，意思是在home组件在出现在页面之前，自动的先来到beformount（）{}
  beforeMount(){
    // console.log('beforeMount被执行了')
    // if(!localStorage.getItem('token')){
    //   this.$router.push({
    //     name:'login'
    //   })
    // }
  },
  created(){
    this.getMenus();
  },
  methods:{
    // 获取菜单
    async getMenus(){
      // 角色为超管 ->超管的token->请求菜单<-token
      // admin 登录 -> 主管 -> 所有权限 -> 主管的token ->
      const res = await this.$http.get(`menus`);
      console.log(res);
      const {meta:{msg,status},data} = res.data;
      if(status===200){
        this.menus = data;
        console.log(res);
      }
    },
    // 退出
    handleLoginout(){
      // 1.清除token
      localStorage.clear();
      // 2.跳转到login
      this.$router.push({
        name:'login'
        // 提示
      })
        this.$message.warning('退出成功')
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  background: #b3c0d1;
}
.middle {
  text-align: center;
  line-height: 60px;
}
/* .aside { */
  /* background-color: red; */
/* } */
.main {
  background: gray;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>
