'use strict'

const base = require('./base'); 
const friendCtrl = require('../controller/friendCtrl');
const router = base.router;

router.get('/friend/searchUser' , friendCtrl.searchUser); // 根据用户id进行模糊查找

module.exports = router;
