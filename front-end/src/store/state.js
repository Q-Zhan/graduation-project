export default {
  user: {
    token: '',
    info: {}, // 用户详细信息
  },
  friend: {
    applyFriend: [],  // 好友请求
    friendList: [], // 用户好友列表
    isSelectingGroup: false, // 是否正在发起群聊选择中
    groupList: [], // 群组列表
  },
  chat: {
    chatList: [ // 聊天列表，需要与后端同步
      // { 
      //   "userID": "123",
      //   "name": "I am Z!", 
      //   "area": "广州", 
      //   "sign": "我就是我，有个性",
      //   "gender": 0, 
      //   "avatar": "http://localhost:8081/img/avatar.jpg", 
      //   "chatMsg": [],
      //   "scrollHeight": 100,
      //   "unreadNum": 1,
      //   "chatType": 0
      // }
    ], 
    chatListIndex: null
  },
  moment: {
    isDetailShow: true, // 展示moment详情
    isCreateShow: false, // 展示新建momment
    momentList: [
      {
        // "userID": "123",
        // "name": "I am Z!", 
        // "area": "广州", 
        // "sign": "我就是我，有个性",
        // "gender": 0, 
        // "avatar": "http://localhost:8081/img/avatar.jpg",
        // "momentText": '..',
        // "momentImgList": [],
      }
    ],
    momentIndex: null
  },
  socket: null
}
