
import { TEST, API } from '../constant'
import 'whatwg-fetch'

export default {
  // register({ commit, state }, { uname, nname, passwd, rpasswd }) {
  //   commit('startLoading')
  //   return fetch(api + '/api/user/create', {
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: 'uname=' + uname + '&' + 'nname=' + nname + '&' + 'passwd=' + passwd + '&' + 'rpasswd=' + rpasswd
  //   })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     let message = ''
  //     // 用户名重复
  //     if (data.message.substring(0,4) == 'User') {
  //       message = '账号名已被注册'
  //     }
  //     // 昵称重复
  //     if (data.message.substring(0,4) == 'Nick') {
  //       message = '昵称已被注册'
  //     }
  //     // 注册成功
  //     if (data.message == '成功') {
  //       message = '注册成功'
  //     }
  //     commit('stopLoading')
  //     return message
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     commit('stopLoading')
  //   })
  // }
}
