import Vue from 'vue'
import Router from 'vue-router'
import { TEST } from './constant'
import Home from './component/Home/Home.vue'


Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/', redirect: '/Home'
    },
    {
      path: '/Home',
      component: Home
    }
  ]
})

// 注销
// router.beforeEach((to, from, next) => {
//   if(localStorage[SECRET]) {
//     next()
//   } else {
//     // 处于已注销状态或第一次进入时，只能跳到logo、login、register
//     if(to.path == '/' || to.path == '/logo' || to.path == '/register' || to.path == '/login') {
//       next()
//     } else {
//       next('/logo')
//     }
//   }
// })

export default router
