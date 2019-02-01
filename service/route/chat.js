'use strict'

const base = require('./base'); 
const chatCtrl = require('../controller/chatCtrl');
const router = base.router;

router.post('/chat/private', chatCtrl.sendPrivateMessage);


module.exports = router;
