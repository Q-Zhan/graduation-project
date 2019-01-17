
import { API, RESPONCE_CODE } from '../constant'
import 'whatwg-fetch'

export default {
  // user模块
  register({ commit, state}, { account, password, mail}) {
    return fetch(API + 'user/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `account=${account}&password=${password}&mail=${mail}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  verifyMail({ commit, state}, { account, mail}) {
    return fetch(API + 'user/verifyMail', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `account=${account}&mail=${mail}`
      // body: `account=${account}&mail=${mail}&jwt=${state.user.token}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  modifyPassword({ commit, state}, { account, password}) {
    return fetch(API + 'user/modifyPassword', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `account=${account}&password=${password}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  login({ commit, state}, { account, password}) {
    return fetch(API + 'user/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `account=${account}&password=${password}`
    })
    .then(res => res.json())
    .then(data => {
      if (data.code == RESPONCE_CODE.success) {
        commit('setToken', {token: data.token});
        commit('setUserInfo', {info: data.userInfo});
      }
      return data;
    })
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },

  // friend模块
  searchUser({ commit, state}, { id }) {
    return fetch(API + `friend/searchUser?userId=${id}`, {
      method: 'get',
      headers: {
        authorization: state.user.token
      }
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  addFriend({ commit, state}, { id }) {
    return fetch(API + `friend/addFriend`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `userId=${id}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  getFriendList({ commit, state}, { }) {
    return fetch(API + `friend/list`, {
      method: 'get',
      headers: {
        authorization: state.user.token
      }
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
}
