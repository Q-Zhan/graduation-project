# 接口
## code规范
0: 成功，-1: 错误, -2: 数据库主键重复, 401: token未认证

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
      userInfo: {}
    }

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

- 同意他人的好友请求
  - url: /friend/accept
  - method: post
  - auth: true
  - argument:  
      userId
  - response: 无



    
