
import { API, RESPONCE_CODE } from '../constant'
import 'whatwg-fetch'

export default {
  /*
    user模块
  */
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
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },


  /*
    friend模块
  */
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
  handleApply({ commit, state}, { id, action }) {
    return fetch(API + `friend/handleApply`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `userId=${id}&action=${action}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  deleteFriend({ commit, state}, { id }) {
    return fetch(API + `friend/deleteFriend`, {
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
  deleteGroup({ commit, state}, { groupId }) {
    return fetch(API + `friend/deleteGroup`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `groupId=${groupId}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  getGroupList({ commit, state}, { }) {
    return fetch(API + `friend/getGroupList`, {
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
  

  /*
    chat模块
  */
  sendPrivateMessage({ commit, state}, { id, message, type }) {
    return fetch(API + `chat/private`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `userId=${id}&content=${message}&type=${type}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  sendGroupMessage({ commit, state}, { groupId, message, type }) {
    return fetch(API + `chat/groupMessage`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `groupId=${groupId}&content=${message}&type=${type}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  getChatList({ commit, state}, { }) {
    return fetch(API + `chat/getChatList`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  addChat({ commit, state}, { chatID, chatType }) {
    return fetch(API + `chat/addChat`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `chatID=${chatID}&chatType=${chatType}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  deleteChat({ commit, state}, { chatID, chatType }) {
    return fetch(API + `chat/deleteChat`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `chatID=${chatID}&chatType=${chatType}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  topChat({ commit, state}, { chatID }) {
    return fetch(API + `chat/topChat`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `chatID=${chatID}`
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  createGroup({ commit, state}, { member }) {
    return fetch(API + `chat/createGroup`, {
      method: 'post',
      headers: {
        authorization: state.user.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(member)
    })
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      return {code: RESPONCE_CODE.error};
    })
  },
  getOfflineMessage({ commit, state}, { }) {
    return fetch(API + `chat/getOfflineMessage`, {
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
