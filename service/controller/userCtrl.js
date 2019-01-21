const jwt= require('jsonwebtoken');

const query = require('./db');
const CODE = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');

const REPEAT_ERROR = 'ER_DUP_ENTRY';
const JWT_SECRET = GLOBAL_CONSTANT.jwtSecret;

async function register(req, res) {
  let { account, password, mail } = req.body;
  let sql = `insert into user_info(userID, password, mail) values(${account}, ${password}, ${mail});`;
  sql += `insert into social_info(userID) values(${account})`
  try {
    const result = await query(sql);
    res.json({
      code: CODE.success,
      result
    });
  } catch(error) {
    if (error.code == REPEAT_ERROR) {
      res.json({
        code: CODE.dbRepeat,
        msg: '主键重复'
      });
    } else {
      res.json({
        code: CODE.error,
        error
      });
    }
  }
}

async function verifyMail(req, res) {
  let { account, mail } = req.body;
  let sql = `select * from user_info where userID=${account}`;
  try {
    const result = await query(sql);
    if (result && result.length > 0 && result[0].mail == mail) {
      res.json({
        code: CODE.success
      });
    } else {
      res.json({
        code: CODE.error
      });
    }
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function modifyPassword(req, res) {
  let { account, password } = req.body;
  let sql = `update user_info set password=${password} where userID=${account}`;

  try {
    const result = await query(sql);
    if (result && result.affectedRows == 1) {
      res.json({
        code: CODE.success
      });
    } else {
      res.json({
        code: CODE.error
      });
    }
  } catch(error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

async function login(req, res) {
  let { account, password } = req.body;
  try {
    let sql = `select * from user_info natural join social_info where userID=${account}`;
    const result = await query(sql);
    if (result && result.length > 0 && result[0].password == password) {
      // 生成token
      const token = jwt.sign({
        account,
        password
      }, JWT_SECRET, {
        expiresIn: '24h' // 过期时间，单位s
      });
      
      // 返回未处理好友请求
      let applyFriendSql = `select * from social_info where userID in (select fromID from friend_apply where toID=${account})`;
      const applyFriendResult = await query(applyFriendSql);

      res.json({
        code: CODE.success,
        token: token,
        userInfo: result[0],
        applyFriend: applyFriendResult
      });
    } else {
      res.json({
        code: CODE.error
      });
    }
  } catch (error) {
    res.json({
      code: CODE.error,
      error
    });
  }
}

module.exports = {
  register,
  verifyMail,
  modifyPassword,
  login
}