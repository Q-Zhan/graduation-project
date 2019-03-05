# 接口
## code规范
0: 成功，-1: 错误, -2: 数据库主键重复, 401: token未认证

## socket模块
- 收到好友请求
  - type: applyFriend
  - argument:
      object, (申请者的信息对象)

- 发出的好友请求的被处理结果
  - type: applyFriendResult
  - argument:
      object, (处理者的信息对象)
      action, (0: 被拒绝, 1: 被接受)

- 收到私聊消息
  - type: privateMessage
  - argument:
      userId,
      type, (0: 纯文字, 1: 图片)
      content

- 收到群聊添加
  - type: addGroup
  - argument:
      groupId,
      groupName,
      member,
      chatMsg,

- 收到群聊消息
  - type: groupMessage
  - argument:
      groupId,
      type, (0: 纯文字, 1: 图片)
      content,
      fromId, (具体发送消息的用户)

- 收到群成员被踢出
  - type: kickMember
  - argument:
      groupId,
      userId, (被踢出的用户)

 

## user模块
- 用户注册
  - url: /user/create
  - method: post
  - auth: false
  - argument:  
      account、password、mail
  - response: 无

- 验证邮箱
  - url: /user/verifyMail
  - method: post
  - auth: false
  - argument:  
      account、mail
  - response: 无

- 找回密码
  - url: /user/modifyPassword
  - method: post
  - auth: false
  - argument:  
      account、password
  - response: 无

- 用户登录
  - url: /user/login
  - method: post
  - auth: false
  - argument:  
      account、password
  - response: 
    {
      token: '...',
      userInfo: {},
      applyFriend: [], (未处理的好友请求列表)
    }

- 修改个人信息
  - url: /user/modifyInfo
  - method: post
  - auth: true
  - argument:  
      name,
      area,
      sign,
      gender,
      avatar
  - response: 无

## friend模块
- 搜索用户(模糊搜索)
  - url: /friend/searchUser
  - method: get
  - auth: true
  - argument: 
      userId
  - response: 
    {
      users: [
        {
          ...用户详细信息
        }
      ]
    }

- 申请添加好友
  - url: /friend/addFriend
  - method: post
  - auth: true
  - argument:  
      userId
  - response: 无

- 获取所有好友
  - url: /friend/list
  - method: get
  - auth: true
  - argument: 无
  - response: 
    {
      list: [
        {
          ...好友详细信息
        }
      ]
    }

- 处理好友请求
  - url: /friend/handleApply
  - method: post
  - auth: true
  - argument:  
      userId,
      action, (0: 拒绝, 1:接受)
  - response: 无

- 删除好友
  - url: /friend/deleteFriend
  - method: post
  - auth: true
  - argument:  
      userId
  - response: 无

- 获取groupList
  - url: /friend/getGroupList
  - method: get
  - auth: true
  - argument: 无
  - response: 无

- 删除自己的群聊（即退群）
  - url: /friend/deleteGroup
  - method: post
  - auth: true
  - argument:  
      groupId
  - response: 无

- 删除他人的群聊（即管理员踢人）
  - url: /friend/kickGroup
  - method: post
  - auth: true
  - argument:  
      groupId,
      userId
  - response: 无
  

## chat模块
- 获取最近聊天列表
  - url: /chat/getChatList
  - method: post
  - auth: true
  - argument: 无
  - response: 
    {
      chatList: [
        {
          "userID":"111",
          "name":"我是小号",
          "area":"东莞",
          "sign":null,
          "gender":1,
          "avatar":null,
          "chatMsg": [
            {"type":0,"from":"123","to":"111","content":"123"},
            {"type":0,"from":"123","to":"111","content":"321"}
          ]
        },
        {
          "groupID": '11',
          "name": '这是一群',
          "groupMember": [
            {
              "userID":"111",
              "name":"我是小号",
              "area":"东莞",
              "sign":null,
              "gender":1,
              "avatar":null,
            }
          ]
          "chatMsg": [

          ]
        }
        ...
      ]
    }

- 发送私聊消息
  - url: /chat/private
  - method: post
  - auth: true
  - argument:  
      userId,
      content,
      type, (0: 纯文字, 1: 图片)
  - response: 
    {
      isSuccess, (0: 好友被删发送失败， 1: 发送成功)
    }
    
- 更新chat的时间戳，使之在查询结果中置顶
  - url: /chat/topChat
  - method: post
  - auth: true
  - argument:  
      chatID,
  - response: 无

- 添加最近聊天列表chat
  - url: /chat/addChat
  - method: post
  - auth: true
  - argument:  
      chatID,
      chatType, (0: 用户, 1: 群组)
  - response: 
    {
      chatMsg, (和该chat的聊天记录)
    }

- 删除最近聊天列表chat
  - url: /chat/deleteChat
  - method: post
  - auth: true
  - argument:  
      chatID,
      chatType
  - response: 无

- 新建群聊
  - url: /chat/createGroup
  - method: post
  - auth: true
  - argument:  
      member: [ // 成员列表，userItem(包含自己)
        {
          avatar: ..,
          name: ...,
          ...
        }
      ], 
  - response: 
    {
      groupItem: {}
    }

- 发送群聊消息
  - url: /chat/groupMessage
  - method: post
  - auth: true
  - argument:  
      groupId,
      content,
      type, (0: 纯文字, 1: 图片)
  - response: 
    {
      isSuccess, (0: 已被群组踢出发送失败， 1: 发送成功, 2: 含有敏感词)
      message, (仅当含有敏感词时，值为过滤后的信息)
    }

- 拉取离线消息，并将离线消息清零
  - url: /chat/getOfflineMessage
  - method: get
  - auth: true
  - argument: 无
  - response: 同getChatList

## moment模块
- 创建moment
  - url: /moment/create
  - method: post
  - auth: true
  - argument: 
      {
        text, (文案)
        imgList, (图片数组，可能为空)
      } 
  - response: 无

- 获取momentList
  - url: /moment/getMomentList
  - method: get
  - auth: true
  - argument: 无
  - response: 
    {
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
      ]
    }



    
