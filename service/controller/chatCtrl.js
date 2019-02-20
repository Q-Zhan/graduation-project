
const query = require('./db');
const CODE = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');
const socket = require('../util/socket');

const REPEAT_ERROR = 'ER_DUP_ENTRY';
const { CHAT_TYPE, PRIVATE_MESSAGE_SUCCESS_TYPE} = GLOBAL_CONSTANT;


async function sendPrivateMessage(req, res) {
  let { userId, content, type } = req.body;
  const uid = req.uid;
  const map = socket.getUserToSocketMap();
  const userIdSocket = map[userId];
  try {
    let selectFriendSql = `select * from friend_ship where userID=${uid} and friendID=${userId}`;
    const selectFriendResult = await query(selectFriendSql);
    if (selectFriendResult.length > 0) {
      // 是好友关系
      let insertPrivateSql = `insert into private_message values(${null}, ${uid}, ${userId}, '${content}', ${+new Date()}, ${type})`;
      const insertPrivateResult = await query(insertPrivateSql);

      if (userIdSocket) {
        // 对方在线
        userIdSocket.emit('privateMessage', userId, type, content);
      } else {
        // 对方离线
        let selectOfflineSql = `select * from offline_message where toId=${userId} and fromId=${uid}`;
        const selectOfflineResult = await query(selectOfflineSql);
        if (selectOfflineResult.length > 0) {
          // 更新
          let num = selectOfflineResult[0].messageNum;
          let updateOfflinesSql = `update offline_message set timeStamp=${+new Date()}, lastMessage='${content}', type=${type}, messageNum=${num+1} where toId=${userId} and fromId=${uid}`
          const updateOfflineResult = await query(updateOfflinesSql);
        } else {
          // 插入
          let insertOfflineSql = `insert into offline_message values(${uid}, ${userId}, ${+new Date()}, '${content}', ${type}, ${1})`;
          const insertOfflineResult = await query(insertOfflineSql);
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
    let selectChatListSql = `select * from chatlist where userID=${uid} order by timeStamp desc`;
    const selectChatListResult = await query(selectChatListSql);
    let chatTypeArr = [];
    let selectPromise = [];
    selectChatListResult.forEach((item, index) => {
      if (item.chatType == CHAT_TYPE.USER) {
        let userID = item.chatID;
        chatTypeArr.push(CHAT_TYPE.USER)
        let sql = `select * from private_message where (toID=${uid} and fromID=${userID}) or (toID=${userID} and fromID=${uid})`
        selectPromise.push(query(sql))
      } else {
        // 群组
      }
    })
    Promise.all(selectPromise)
    .then(async (data) => {
      let result = [];
      for(let i = 0; i < data.length; i++) {
        if (chatTypeArr[i] == CHAT_TYPE.USER) {
          // 用户
          const userID = selectChatListResult[i].chatID;
          const chatMsg = data[i];
          // 获取用户个人资料
          let sql = `select * from social_info where userID=${userID}`;
          const sqlResult = await query(sql);
          const userInfo = sqlResult[0] || {};
          // 拼接信息
          userInfo.chatMsg = chatMsg;
          result[i] = userInfo;
        } else {
          // 群组
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
    let sql = `insert into chatlist values(${uid}, ${chatID}, ${chatType}, ${+new Date()})`;
    const result = await query(sql);
    let selectPrivateMessageSql = `select * from private_message where (fromID=${uid} and toID=${chatID}) or (fromID=${chatID} and toID=${uid})`;
    const selectResult = await query(selectPrivateMessageSql)
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
    let sql = `delete from chatlist where userID=${uid} and chatID=${chatID}`;
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
    let sql = `update chatlist set timeStamp=${+new Date()} where userID=${uid} and chatID=${chatID}`;
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

module.exports = {
  sendPrivateMessage,
  getChatList,
  addChat,
  deleteChat,
  topChat
}