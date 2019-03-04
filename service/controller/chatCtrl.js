
const query = require('./db');
const CODE = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');
const socket = require('../util/socket');

const REPEAT_ERROR = 'ER_DUP_ENTRY';
const { CHAT_TYPE, PRIVATE_MESSAGE_SUCCESS_TYPE, MESSAGE_TYPE} = GLOBAL_CONSTANT;


async function sendPrivateMessage(req, res) {
  let { userId, content, type } = req.body;
  const uid = req.uid;
  const map = socket.getUserToSocketMap();
  const userIdSocket = map[userId];
  try {
    let selectFriendSql = `select * from friend_ship where userID='${uid}' and friendID='${userId}'`;
    const selectFriendResult = await query(selectFriendSql);
    if (selectFriendResult.length > 0) {
      // 是好友关系
      let insertPrivateSql = `insert into private_message values(${null}, '${uid}', '${userId}', '${content}', ${+new Date()}, ${type})`;
      const insertPrivateResult = await query(insertPrivateSql);

      if (userIdSocket) {
        // 对方在线
        userIdSocket.emit('privateMessage', uid, type, content);
      } else {
        // 对方离线

        // 更新offline_message
        let selectOfflineSql = `select * from offline_message where toId='${userId}' and fromId='${uid}' and chatType=${CHAT_TYPE.USER}`;
        const selectOfflineResult = await query(selectOfflineSql);
        if (selectOfflineResult.length > 0) {
          // 更新
          let num = selectOfflineResult[0].messageNum;
          let updateOfflinesSql = `update offline_message set timeStamp=${+new Date()}, lastMessage='${content}', type=${type}, messageNum=${num+1} where toId='${userId}' and fromId='${uid}' and chatType=${CHAT_TYPE.USER}`;
          const updateOfflineResult = await query(updateOfflinesSql);
        } else {
          // 插入
          let insertOfflineSql = `insert into offline_message values('${uid}', '${userId}', ${+new Date()}, '${content}', ${type}, ${1}, ${null}, ${CHAT_TYPE.USER})`;
          const insertOfflineResult = await query(insertOfflineSql);
        }

        // 更新对方的chatList
        let selectChatlistSql = `select * from chatlist where userID='${userId}' and chatID='${uid}'`;
        const selectChatlistResult = await query(selectChatlistSql);
        if (selectChatlistResult.length > 0) {
          let updateChatlistSql = `update chatlist set timeStamp=${+new Date()} where userID='${userId}' and chatID='${uid}'`;
          const updateChatlistResult = await query(updateChatlistSql);
        } else {
          let insertChatlistSql = `insert into chatlist values('${userId}', '${uid}', ${CHAT_TYPE.USER}, ${+new Date()})`;
          const insertChatlistResult = await query(insertChatlistSql);
        }
      }
      res.json({
        code: CODE.success,
        isSuccess: PRIVATE_MESSAGE_SUCCESS_TYPE.SUCCESS
      });
    } else {
      // 不是好友关系
      res.json({
        code: CODE.success,
        isSuccess: PRIVATE_MESSAGE_SUCCESS_TYPE.FAIL
      })
    }

    
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function getChatList(req, res) {
  const uid = req.uid;
  try {
    let selectChatListSql = `select * from chatlist where userID='${uid}' order by timeStamp desc`;
    const selectChatListResult = await query(selectChatListSql);
    let chatTypeArr = [];
    let selectPromise = [];
    
    for (let i = 0; i < selectChatListResult.length; i++) {
      let item = selectChatListResult[i];
      if (item.chatType == CHAT_TYPE.USER) {
        let userID = item.chatID;
        chatTypeArr.push(CHAT_TYPE.USER)
        let sql = `select * from private_message where (toID='${uid}' and fromID='${userID}') or (toID='${userID}' and fromID='${uid}')`
        selectPromise.push(query(sql))
      } else {
        // 群组
        let groupId = item.chatID;
        chatTypeArr.push(CHAT_TYPE.GROUP);
        // 检查是否请求用户是否还在群中
        let selectUserGroup = `select * from user_group where userID='${uid}' and groupID='${groupId}'`;
        const selectUserGroupResult = await query(selectUserGroup);
        if (selectUserGroupResult.length <= 0) {
          // 不在群中，返回空的chatMsg
          groupId = -1;
        }
        let sql = `select * from group_message where groupID=${groupId}`;
        selectPromise.push(query(sql))
      }
    }

    Promise.all(selectPromise)
    .then(async (data) => {
      let result = [];
      for(let i = 0; i < data.length; i++) {
        if (chatTypeArr[i] == CHAT_TYPE.USER) {
          // 用户
          const userID = selectChatListResult[i].chatID;
          const chatMsg = data[i];
          // 获取用户个人资料
          let sql = `select * from social_info where userID='${userID}'`;
          const sqlResult = await query(sql);
          const userInfo = sqlResult[0] || {};
          // 拼接信息
          userInfo.chatMsg = chatMsg;
          result[i] = userInfo;
        } else {
          // 群组
          const groupId = selectChatListResult[i].chatID;
          const chatMsg = data[i];
          // 获取群组资料
          let selectGroupInfoSql = `select * from group_info where id=${groupId}`;
          const selectGroupInfoResult = await query(selectGroupInfoSql);
          const groupName = selectGroupInfoResult[0].name;
          // 获取群组成员
          let selectUserGroupSql = `select * from user_group natural join social_info where groupID=${groupId}`;
          const selectUserGroupResult = await query(selectUserGroupSql);
          const member = [];
          for (let j = 0; j < selectUserGroupResult.length; j++) {
            member.push(selectUserGroupResult[j]);
          }
          
          // 拼接信息
          let group = {
            groupName,
            groupId,
            chatMsg,
            member
          };
          result[i] = group;
        }
      }
      res.json({
        code: CODE.success,
        chatList: result
      })
    }) 
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function addChat(req, res) {
  const uid = req.uid;
  const { chatID, chatType } = req.body;
  try {
    let sql = `insert into chatlist values('${uid}', '${chatID}', ${chatType}, ${+new Date()})`;
    const result = await query(sql);
    let selectSql = '';
    if (chatType == CHAT_TYPE.USER) {
      selectSql = `select * from private_message where (fromID='${uid}' and toID='${chatID}') or (fromID='${chatID}' and toID='${uid}')`;
    } else {
      let groupId = chatID;
      // 检查是否请求用户是否还在群中
      let selectUserGroup = `select * from user_group where userID='${uid}' and groupID='${groupId}'`;
      const selectUserGroupResult = await query(selectUserGroup);
      if (selectUserGroupResult.length <= 0) {
        // 不在群中，返回空的chatMsg
        groupId = -1;
      }
      selectSql = `select * from group_message where groupID=${groupId}`;
    }
    
    const selectResult = await query(selectSql)
    res.json({
      code: CODE.success,
      chatMsg: selectResult
    })
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function deleteChat(req, res) {
  const uid = req.uid;
  const { chatID } = req.body;
  try {
    let sql = `delete from chatlist where userID='${uid}' and chatID='${chatID}'`;
    const result = await query(sql);
    res.json({
      code: CODE.success
    })
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function topChat(req, res) {
  const uid = req.uid;
  const { chatID } = req.body;
  try {
    let sql = `update chatlist set timeStamp=${+new Date()} where userID='${uid}' and chatID='${chatID}'`;
    const result = await query(sql);
    res.json({
      code: CODE.success
    })
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function createGroup(req, res) {
  const uid = req.uid;
  const member = req.body;
  const map = socket.getUserToSocketMap();
  const message = '我新建了该群聊，快来聊天吧~';
  try {
    let groupName = ''; // 群初始名字
    member.forEach((item) => {
      groupName += `${item.name}、`;
    });
    // 插入group_info
    groupName = groupName.slice(0, groupName.length - 1); // 去掉最后一个顿号
    const insertGroupInfoSql = `insert into group_info values(null, '${groupName}')`;
    const insertGroupInfoResult = await query(insertGroupInfoSql);
    const groupId = insertGroupInfoResult.insertId;
    // 插入user_group
    let insertUserGroupSql = `insert into user_group values`;
    member.forEach((item) => {
      insertUserGroupSql += `('${item.userID}', ${groupId}, ${+new Date()}),`;
    });
    insertUserGroupSql = insertUserGroupSql.slice(0, insertUserGroupSql.length - 1);
    const insertUserGroupResult = await query(insertUserGroupSql);

    // 更新group_message
    const insertGroupMessageSql = `insert into group_message values(${null}, '${groupId}', '${uid}', '${message}', ${+new Date()}, ${MESSAGE_TYPE.TEXT})`;
    const insertGroupMessageResult = await query(insertGroupMessageSql);

    // 更新群员的chatList,不包括群主
    const groupMember = member.slice(1);

    let chatMsg = [{ 
      "groupID": groupId, 
      "fromId": uid, 
      "content": message, 
      "timeStamp": (+new Date()), 
      "type": MESSAGE_TYPE.TEXT
    }]
    member.forEach(async (item, index) => {
      const userId = item.userID;
      const userIdSocket = map[userId];
      
      if (userIdSocket) {
        // 对方在线
        // 通知更新groupList
        
        userIdSocket.emit('addGroup', groupId, groupName, member, chatMsg)
        // 通知一条新的群组消息
        userIdSocket.emit('groupMessage', groupId, MESSAGE_TYPE.TEXT, message, uid);
      } else {
        // 对方离线

        // 插入offline
        let insertOfflineSql = `insert into offline_message values('${groupId}', '${userId}', ${+new Date()}, '${message}', ${MESSAGE_TYPE.TEXT}, ${1}, '${uid}', ${CHAT_TYPE.GROUP})`;
        const insertOfflineResult = await query(insertOfflineSql);

        // 更新对方的chatList
        let insertChatlistSql = `insert into chatlist values('${userId}', ${groupId}, ${CHAT_TYPE.GROUP}, ${+new Date()})`;
        const insertChatlistResult = await query(insertChatlistSql);

      }
    })

    res.json({
      code: CODE.success,
      groupItem: {
        groupId,
        groupName,
        member,
        chatMsg
      }
    })
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function getOfflineMessage(req, res) {
  const uid = req.uid;
  try {
    const selectOfflineSql = `select * from offline_message where toId='${uid}'`;
    const selectOfflineResult = await query(selectOfflineSql);
    let result = [];

    // 补充chatMsg
    for (let i = 0; i < selectOfflineResult.length; i++) {
      const item = selectOfflineResult[i];
      if (item.chatType == CHAT_TYPE.USER) {
        // 私聊消息
        const userID = item.fromId;
        const selectPrivateMessageSql = `select * from private_message where (toID='${uid}' and fromID='${userID}') or (toID='${userID}' and fromID='${uid}')`
        const selectPrivateMessageResult = await query(selectPrivateMessageSql);
        item.chatMsg = selectPrivateMessageResult;
        result.push(item);
      } else if (item.chatType == CHAT_TYPE.GROUP) {
        // 群聊消息
        const groupId = item.fromId;
        const selectGroupMessage = `select * from group_message where groupID=${groupId}`;
        const selectGroupMessageResult = await query(selectGroupMessage);
        item.chatMsg = selectGroupMessageResult;
        result.push(item)
      }
      
    }
    // 清空
    const deleteOfflineSql = `delete from offline_message where toId='${uid}'`;
    const deleteOfflineResult = await query(deleteOfflineSql);
    res.json({
      code: CODE.success,
      result
    })
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function sendGroupMessage(req, res) {
  let { groupId, content, type } = req.body;
  const uid = req.uid;
  const map = socket.getUserToSocketMap();
  
  try {
    // 检查是否还在群中
    let selectUserGroup = `select * from user_group where userID='${uid}' and groupID=${groupId}`;
    let selectUserGroupResult = await query(selectUserGroup);
    if (selectUserGroupResult.length > 0) {
      // 在群中
      let insertGroupMessage = `insert into group_message values(${null}, '${groupId}', '${uid}', '${content}', ${+new Date()}, ${type})`;
      const insertGroupMessageResult = await query(insertGroupMessage);
      // 获取群成员
      let getMemberSql = `select * from user_group where groupID=${groupId}`;
      const memberIds = await query(getMemberSql);
      for (let i = 0; i < memberIds.length; i++) {
        const element = memberIds[i];
        const memberId = element.userID; 
        // 不通知自己
        if (memberId == uid) {
          continue;
        }
        const userIdSocket = map[memberId];
        if (userIdSocket) {
          // 成员在线
          userIdSocket.emit('groupMessage', groupId, type, content, uid);
        } else {
          // 成员离线
          // 更新offline_message
          let selectOfflineSql = `select * from offline_message where toId='${memberId}' and fromId='${groupId}' and chatType=${CHAT_TYPE.GROUP}`;
          const selectOfflineResult = await query(selectOfflineSql);
          if (selectOfflineResult.length > 0) {
            // 更新
            let num = selectOfflineResult[0].messageNum;
            let updateOfflinesSql = `update offline_message set timeStamp=${+new Date()}, lastMessage='${content}', type=${type}, messageNum=${num+1}, senderId='${uid}' where toId='${memberId}' and fromId='${groupId}' and chatType=${CHAT_TYPE.GROUP}`;
            const updateOfflineResult = await query(updateOfflinesSql);
          } else {
            // 插入
            let insertOfflineSql = `insert into offline_message values('${groupId}', '${memberId}', ${+new Date()}, '${content}', ${type}, ${1}, '${uid}', ${CHAT_TYPE.GROUP})`;
            const insertOfflineResult = await query(insertOfflineSql);
          }
          // 更新对方的chatList
          let selectChatlistSql = `select * from chatlist where userID='${memberId}' and chatID='${groupId}'`;
          const selectChatlistResult = await query(selectChatlistSql);
          if (selectChatlistResult.length > 0) {
            let updateChatlistSql = `update chatlist set timeStamp=${+new Date()} where userID='${memberId}' and chatID='${groupId}'`;
            const updateChatlistResult = await query(updateChatlistSql);
          } else {
            let insertChatlistSql = `insert into chatlist values('${memberId}', '${groupId}', ${CHAT_TYPE.GROUP}, ${+new Date()})`;
            const insertChatlistResult = await query(insertChatlistSql);
          }
        }
      }
      res.json({
        code: CODE.success,
        isSuccess: PRIVATE_MESSAGE_SUCCESS_TYPE.SUCCESS
      });
    } else {
      res.json({
        code: CODE.success,
        isSuccess: PRIVATE_MESSAGE_SUCCESS_TYPE.FAIL
      })
    }
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}


module.exports = {
  sendPrivateMessage,
  getChatList,
  addChat,
  deleteChat,
  topChat,
  createGroup,
  getOfflineMessage,
  sendGroupMessage
}