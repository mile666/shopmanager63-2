// 让axios变成Vue插件
// 把axios相关代码封装成Vue的插件
// 结果 在main.js可以Vue.use(axios)

// Vue插件
// JQ 插件 ->文档
import axios from "axios";

const HttpServer = {};
HttpServer.install = function(Vue) {
  // 插件要封装的功能
  // 独立功能 ->js ->模块
  axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";

  // 除了登录之外，才需要下面2行代码
  // 登录的响应res 和其他的请求req 一样
  // 拦截-> axios拦截请求

  // 请求拦截器的代码
  // 100个请求
  axios.interceptors.request.use(function(config) {
      // 在发送请求之前做些什么
      console.log(config);
      
      // console.log("拦截器被触发---");
      // 1.header 请求头
      // 2.url 请求的标识路径
      // console.log(config);
      // 当请求是login，直接发送请求
      if (config.url !== "login") {
        // 设置头部
        const AUTH_TOKEN = localStorage.getItem("token");
        // 给当前请求设置请求头
        // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
        config.headers["Authorization"] = AUTH_TOKEN;
      }
      // 当请求不是login，先加头部，然后继续发送请求

      return config;
    },
    function(error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );

  Vue.prototype.$http = axios;
  // 添加实例方法
  // Vue.prototype.$myMethod = function (methodOptions) {
  // }
};
export default HttpServer;
