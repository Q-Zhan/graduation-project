
const db = require('./db');
const CODE = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');
const socket = require('../util/socket');

function searchUser(req, res) {
  let { userId } = req.query;
  let sql = `select * from social_info where userID like '%${userId}%'`;
  db.query(sql, function(error, result) {
    if (error) {
      res.json({
        code: CODE.error,
        error
      });
    } else {
      res.json({
        code: CODE.success,
        users: result
      });
    }
  })
}

function addFriend(req, res) {
  const { userId } = req.body;
  const uid = req.uid; // 请求接口的用户的id

  const map = socket.getUserToSocketMap()
  const uidSocket = map[uid];
  const userIdSocket = map[userId];
  
  let sql = `select * from social_info where userID=${uid}`;
  db.query(sql, function(error, result) {
    if (error) {
      res.json({
        code: CODE.error,
        error
      });
    } else {
      userIdSocket.emit('applyFriend', result[0]);
      res.json({
        code: CODE.success
      });
    }
  })
  //socket.to(userIdSocket.id).emit('applyFriend')

  // let sql = `insert into friend(userID, friendID, timeStamp) values(${uid}, ${userId}, ${+new Date()})`;
  // db.query(sql, function(error, result) {
  //   if (error) {
  //     res.json({
  //       code: CODE.error,
  //       error
  //     });
  //   } else {
  //     console.log(result);
  //     res.json({
  //       code: CODE.success
  //     });
  //   }
  // })
}


module.exports = {
    searchUser,
    addFriend
}