
const query = require('./db');
const CODE = require('../constant/responseCode');
const GLOBAL_CONSTANT = require('../constant/global');
const socket = require('../util/socket');

const REPEAT_ERROR = 'ER_DUP_ENTRY';


async function sendPrivateMessage(req, res) {
  let { userId } = req.query;
  const uid = req.uid;
  let sql = `select * from social_info where
             userID like '%${userId}%'
             and userID <> ${uid}
             and userID not in (select friendID from friend_ship where userID=${uid})`;
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


module.exports = {
    sendPrivateMessage,
    
}