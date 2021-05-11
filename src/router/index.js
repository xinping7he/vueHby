//默认使用hash模式，vue-router还有许多功能，详情请查
import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue' 先引入组件，配置路由的时候，component选项就可以使用被赋值的变量

Vue.use(VueRouter)


const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },

]

const router = new VueRouter({
  routes
})

export default router
