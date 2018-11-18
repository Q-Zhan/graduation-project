import Vue from 'vue'
import Router from 'vue-router'


import Home from './component/Home/index.vue'
import Login from './component/Login/index.vue'
import Forget from './component/Forget/index.vue'
import Register from './component/Register/index.vue'
import NotChoose from './component/NotChoose/index.vue'


Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/', redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/forget',
      component: Forget
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/', component: NotChoose }
      ]
    },

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
