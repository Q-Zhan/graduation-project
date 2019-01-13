
import { API, responceCode } from '../constant'
import 'whatwg-fetch'

export default {
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
      return {code: responceCode.error};
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
      return {code: responceCode.error};
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
      return {code: responceCode.error};
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
      if (data.code == responceCode.success) {
        commit('getToken', {token: data.token})
      }
      return data;
    })
    .catch(err => {
      console.error(err)
      return {code: responceCode.error};
    })
  },
  searchUser({ commit, state}, { id }) {
    return fetch(API + `friend/searchUser?userId=${id}`, {
      method: 'get',
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: responceCode.error};
    })
  },
}
