'use strict'

const base = require('./base'); 
const chatCtrl = require('../controller/chatCtrl');
const router = base.router;

router.post('/chat/private', chatCtrl.sendPrivateMessage);
router.post('/chat/getChatList', chatCtrl.getChatList);
router.post('/chat/addChat', chatCtrl.addChat);
router.post('/chat/deleteChat', chatCtrl.deleteChat);
router.post('/chat/topChat', chatCtrl.topChat);
router.post('/chat/createGroup', chatCtrl.createGroup);
router.get('/chat/getOfflineMessage', chatCtrl.getOfflineMessage);
router.post('/chat/groupMessage', chatCtrl.sendGroupMessage);

module.exports = router;
