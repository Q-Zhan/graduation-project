import Vue from 'vue'
import Router from 'vue-router'


import Home from './component/Home/index.vue'
import Login from './component/Login/index.vue'
import Forget from './component/Forget/index.vue'
import Register from './component/Register/index.vue'
import NotChoose from './component/NotChoose/index.vue'
import ChatList from './component/ChatList/index.vue'
import ChatRoom from './component/ChatRoom/index.vue'
import MomentList from './component/MomentList/index.vue'
import MomentDetail from './component/MomentDetail/index.vue'
import FriendList from './component/FriendList/index.vue'
import FriendDetail from './component/FriendDetail/index.vue'
import AddFriend from './component/AddFriend/index.vue'


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
        { 
          path: '/', 
          redirect: '/home/chat'
        },
        { 
          path: 'chat', 
          components: {
            list: ChatList, // 包含公共聊天室
            detail: ChatRoom
          },
          meta: {
            listTabs: 'chat', // 用于列表切换
          }
        },
        { 
          path: 'moment', 
          components: {
            list: MomentList,
            detail: MomentDetail
          },
          meta: {
            listTabs: 'moment'
          }
        },
        { 
          path: 'friend',
          components: {
            list: FriendList,
            detail: FriendDetail
          },
          meta: {
            listTabs: 'friend'
          } 
        },
        { 
          path: 'addFriend', 
          components: {
            list: FriendList,
            detail: AddFriend
          },
          meta: {
            listTabs: 'friend', // 用于列表切换
          }
        }
        // { 
        //   path: 'moment', 
        //   components: {
        //     list: MomentList,
        //     detail: MomentDetail
        //   } 
        // },
        // { 
        //   path: 'friend', 
        //   components: {
        //     list: FriendList,
        //     detail: FriendDetail
        //   } 
        // },
        // { 
        //   path: 'addFriend', 
        //   components: {
        //     list: FriendList,
        //     detail: AddFriend
        //   } 
        // },
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
