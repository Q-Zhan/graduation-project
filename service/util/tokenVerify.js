const jwt = require('jsonwebtoken');
const GLOBAL_CONSTANT = require('../constant/global');
const responseCode = require('../constant/responseCode');

module.exports = function tokenVerify(req, res, next) {
  // socket请求另外由socket.io自己校验
  if (req.originalUrl.indexOf('/user') >= 0 || req.originalUrl.indexOf('socket.io') >= 0) {
    next();
  } else {
    // console.log(req.headers["authorization"]);
    const token = req.body.jwt;
    console.log('jwt error url')
    console.log(req.originalUrl)
    if (!token) {
      res.json({
        code: responseCode.unAuth
      });
    }
    jwt.verify(token, GLOBAL_CONSTANT.jwtSecret, function(err, decoded) {
      if (err) {
        console.log('jwt error')
        console.log(err)
        res.json({
          code: responseCode.unAuth
        });
      } else {
        req.account = decoded.account;
        next();
      }
    });
  }
}