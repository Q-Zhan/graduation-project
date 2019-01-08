
const db = require('./db');
const CODE = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');

function searchUser(req, res) {
    let { userId } = req.query;
    let sql = `select * from user_info where userID like '%${userId}%'`;
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

function addFriend() {
  
}


module.exports = {
    searchUser
}