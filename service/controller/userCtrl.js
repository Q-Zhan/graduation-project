const jwt= require('jsonwebtoken');

const db = require('./db');
const CODE = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');

const REPEAT_ERROR = 'ER_DUP_ENTRY';
const JWT_SECRET = GLOBAL_CONSTANT.jwtSecret;

function register(req, res) {
  let { account, password, mail } = req.body;
  let sql = `insert into user_info(userID, password, mail) values(${account}, ${password}, ${mail});`;
  sql += `insert into social_info(userID) values(${account})`
  db.query(sql, function (error, result) {
    if (error) {
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
    } else {
      res.json({
        code: CODE.success
      });
    }
  });
}

function verifyMail(req, res) {
  let { account, mail } = req.body;
  let sql = `select * from user_info where userID=?`;
  let sqlParams = [account];
  db.query(sql, sqlParams,function (error, result) {
    if (error) {
      res.json({
        code: CODE.error,
        error
      });
    } else {
      if (result && result.length > 0 && result[0].mail == mail) {
        res.json({
          code: CODE.success
        });
      } else {
        res.json({
          code: CODE.error
        });
      }
    }
  });
}

function modifyPassword(req, res) {
  let { account, password } = req.body;
  let sql = 'update user_info set password=? where userID=?';
  let sqlParams = [password, account];
  db.query(sql, sqlParams,function (error, result) {
    if (error) {
      res.json({
        code: CODE.error,
        error
      });
    } else {
      if (result && result.affectedRows == 1) {
        res.json({
          code: CODE.success
        });
      } else {
        res.json({
          code: CODE.error
        });
      }
    }
  });
}

function login(req, res) {
  let { account, password } = req.body;
  let sql = 'select * from user_info natural join social_info where userID=?';
  let sqlParams = [account];
  db.query(sql, sqlParams,function (error, result) {
    if (error) {
      res.json({
        code: CODE.error,
        error
      });
    } else {
      if (result && result.length > 0 && result[0].password == password) {
        const token = jwt.sign({
          account,
          password
        }, JWT_SECRET, {
          expiresIn: '24h' // 过期时间，单位s
        });
        res.json({
          code: CODE.success,
          token: token,
          userInfo: result[0]
        });
      } else {
        res.json({
          code: CODE.error
        });
      }
    }
  });
}

module.exports = {
  register,
  verifyMail,
  modifyPassword,
  login
}