const jwt = require('jsonwebtoken');
const GLOBAL_CONSTANT = require('../constant/global');
const responseCode = require('../constant/responseCode');

module.exports = function tokenVerify(req, res, next) {
  if (req.originalUrl.indexOf('/user') >= 0) {
    next();
  } else {
    // console.log(req.headers["authorization"]);
    const token = req.body.jwt;
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