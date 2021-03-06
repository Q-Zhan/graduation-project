const jwt = require('jsonwebtoken');
const GLOBAL_CONSTANT = require('../constant/global');
const responseCode = require('../constant/responseCode');

let orginUrl = '';
function check(str) {
  return orginUrl.indexOf(str) >= 0;
}

module.exports = function tokenVerify(req, res, next) {
  const ignoreAuthType = [ // 免校验
    'user/create',
    'user/verifyMail',
    'user/modifyPassword',
    'user/login',
    'socket',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif'
  ];
  orginUrl = req.originalUrl;
  if (ignoreAuthType.some(check)) {
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