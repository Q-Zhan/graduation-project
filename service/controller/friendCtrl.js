
const query = require('./db');
const CODE = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');
const socket = require('../util/socket');

const REPEAT_ERROR = 'ER_DUP_ENTRY';
const ACTION_TYPE = {
  ACCEPT: 1,
  REFUSE: 0
}
const { CHAT_TYPE, PRIVATE_MESSAGE_SUCCESS_TYPE} = GLOBAL_CONSTANT;

async function searchUser(req, res) {
  let { userId } = req.query;
  const uid = req.uid;
  let sql = `select * from social_info where
             userID like '%${userId}%'
             and userID <> '${uid}'
             and userID not in (select friendID from friend_ship where userID='${uid}')`;
  try {
    const result = await query(sql);
    res.json({
      code: CODE.success,
      users: result
    });
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function addFriend(req, res) {
  const { userId } = req.body;
  const uid = req.uid; // 请求接口的用户的id

  const map = socket.getUserToSocketMap()
  const userIdSocket = map[userId];
  
  try {
    let applySql = `insert ignore into friend_apply(fromID, toID) values('${uid}', '${userId}')`;
    const insertResult = await query(applySql);
    if (userIdSocket) {
      // 对方在线
      let selectSql = `select * from social_info where userID='${uid}'`;
      const selectResult = await query(selectSql);
      // 通知对方
      userIdSocket.emit('applyFriend', selectResult[0]);
    }
    res.json({
      code: CODE.success
    });
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function getFriendList(req, res) {
  const uid = req.uid;
  let sql = `select * from social_info where userID in (select friendID from friend_ship where userID='${uid}')`;
  try {
    const result = await query(sql);
    res.json({
      code: CODE.success,
      list: result
    });
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function handleApply(req, res) {
  const uid = req.uid;
  const { userId, action } = req.body;
  
  const map = socket.getUserToSocketMap()
  const userIdSocket = map[userId];

  try {
    let deleteSql = `delete from friend_apply where fromID='${userId}' and toID='${uid}'`;
    const deleteResult = await query(deleteSql);
    if (action == ACTION_TYPE.ACCEPT) {
      // 接受
      let insertSql = `insert ignore into friend_ship(userID, friendID, timeStamp) values('${uid}', '${userId}', ${+new Date()});`;
      insertSql += `insert ignore into friend_ship(userID, friendID, timeStamp) values('${userId}', '${uid}', ${+new Date()})`;
      const insertResult = await query(insertSql);
    } 
    if (userIdSocket) {
      // 对方在线
      let selectSql = `select * from social_info where userID='${uid}'`;
      const selectResult = await query(selectSql);
      // 通知对方
      userIdSocket.emit('applyFriendResult', selectResult[0], action);
    }
    res.json({
      code: CODE.success
    });
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function deleteFriend(req, res) {
  const uid = req.uid;
  const { userId } = req.body;

  try {
    let deleteSql = `delete from friend_ship where (userID='${userId}' and friendID='${uid}') or (userID='${uid}' and friendID='${userId}');`;
    deleteSql += `delete from chatlist where userID='${uid}' and chatID='${userId}' and chatType=${CHAT_TYPE.USER}`;
    const deleteResult = await query(deleteSql);
    res.json({
      code: CODE.success
    });
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function deleteGroup(req, res) {
  const uid = req.uid;
  const { groupId } = req.body;

  try {
    let deleteSql = `delete from user_group where userID='${uid}' and groupID=${groupId};`;
    deleteSql += `delete from chatlist where userID='${uid}' and chatID=${groupId} and chatType=${CHAT_TYPE.GROUP}`;
    const deleteResult = await query(deleteSql);
    res.json({
      code: CODE.success
    });
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function getGroupList(req, res) {
  const uid = req.uid;
  try {
    const result = [];
    let selectUserGroupSql = `select * from user_group where userID='${uid}'`;
    const selectUserGroupResult = await query(selectUserGroupSql);
    for (const element of selectUserGroupResult) {
      const groupId = element.groupID;
      // 获取名字
      const selectGroupInfoSql = `select * from group_info where id=${groupId}`;
      const selectGroupInfoResult = await query(selectGroupInfoSql);
      const groupName = selectGroupInfoResult[0].name;
      // 获取成员
      const selectMember = `select userID,timeStamp, name, area, sign, gender, avatar from user_group natural join social_info where groupID=${groupId}`;
      const selectMemberResult = await query(selectMember);
      // 获取聊天记录
      const selectGroupMessage = `select * from group_message where groupID=${groupId}`;
      const selectGroupMessageResult = await query(selectGroupMessage);
      // 整合
      result.push({
        groupId,
        groupName,
        member: selectMemberResult,
        chatMsg: selectGroupMessageResult
      });
    }
   
    res.json({
      code: CODE.success,
      list: result
    });
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

module.exports = {
    searchUser,
    addFriend,
    getFriendList,
    handleApply,
    deleteFriend,
    getGroupList,
    deleteGroup
}