const jwt = require('jsonwebtoken');
const GLOBAL_CONSTANT = require('../constant/global');
const responseCode = require('../constant/responseCode');

module.exports = function tokenVerify(req, res, next) {
  // socket请求另外由socket.io自己校验
  if (req.originalUrl.indexOf('/user') >= 0 || req.originalUrl.indexOf('socket.io') >= 0) {
    next();
  } else {
    const token = req.headers["authorization"];
    if (!token) {
      res.json({
        code: responseCode.unAuth
      });
    } else {
      jwt.verify(token, GLOBAL_CONSTANT.jwtSecret, function(err, decoded) {
        if (err) {
          console.log('jwt error')
          console.log(err)
          res.json({
            code: responseCode.unAuth
          });
        } else {
          req.uid = decoded.account;
          next();
        }
      });
    }
  }
}