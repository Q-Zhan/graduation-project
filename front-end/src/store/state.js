export default {
  user: {
    token: '',
    info: {}, // 用户详细信息
  },
  friend: {
    applyFriend: [],  // 好友请求
    friendList: [], // 用户好友列表
  },
  chat: {
    chatList: [], // 聊天列表，需要与后端同步
  },
  socket: null
}
