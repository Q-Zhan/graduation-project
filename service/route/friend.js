'use strict'

const base = require('./base'); 
const friendCtrl = require('../controller/friendCtrl');
const router = base.router;

router.get('/friend/searchUser' , friendCtrl.searchUser); // 根据用户id进行模糊查找
router.post('/friend/addFriend', friendCtrl.addFriend);
router.get('/friend/list' , friendCtrl.getFriendList);
router.post('/friend/handleApply', friendCtrl.handleApply);

module.exports = router;
