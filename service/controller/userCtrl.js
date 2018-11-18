const jwt= require('jsonwebtoken');

const db = require('./db');
const code = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');

const REPEAT_ERROR = 'ER_DUP_ENTRY';
const JWT_SECRET = GLOBAL_CONSTANT.jwtSecret;

function register(req, res) {
  let { account, password, mail } = req.body;
  let sql = `insert into user_info(userID, password, mail) values(${account}, ${password}, ${mail})`;
  db.query(sql, function (error, results) {
    if (error) {
      if (error.code == REPEAT_ERROR) {
        res.json({
          code: code.dbRepeat,
          msg: '主键重复'
        });
      } else {
        res.json({
          code: code.error
        });
      }
    } else {
      res.json({
        code: code.success
      });
    }
  });
}

function verifyMail(req, res) {
  let { account, mail } = req.body;
  let sql = `select * from user_info where userID=?`;
  let sqlParams = [account];
  db.query(sql, sqlParams,function (error, results) {
    if (error) {
      res.json({
        code: code.error
      });
    } else {
      if (results && results.length > 0 && results[0].mail == mail) {
        res.json({
          code: code.success
        });
      } else {
        res.json({
          code: code.error
        });
      }
    }
  });
}

function modifyPassword(req, res) {
  let { account, password } = req.body;
  let sql = 'update user_info set password=? where userID=?';
  let sqlParams = [password, account];
  db.query(sql, sqlParams,function (error, results) {
    if (error) {
      res.json({
        code: code.error
      });
    } else {
      if (results && results.affectedRows == 1) {
        res.json({
          code: code.success
        });
      } else {
        res.json({
          code: code.error
        });
      }
    }
  });
}

function login(req, res) {
  let { account, password } = req.body;
  let sql = 'select * from user_info where userID=?';
  let sqlParams = [account];
  db.query(sql, sqlParams,function (error, results) {
    if (error) {
      res.json({
        code: code.error
      });
    } else {
      if (results && results.length > 0 && results[0].password == password) {
        const token = jwt.sign({
          account,
          password
        }, JWT_SECRET, {
          expiresIn: 60 // 600s
        });
        res.json({
          code: code.success,
          token: token
        });
      } else {
        res.json({
          code: code.error
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