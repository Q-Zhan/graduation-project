'use strict'

const base = require('./base'); 
const userCtrl = require('../controller/userCtrl');
const router = base.router;

router.post('/user/create', userCtrl.register);
router.post('/user/verifyMail', userCtrl.verifyMail);
router.post('/user/modifyPassword', userCtrl.modifyPassword);
router.post('/user/login', userCtrl.login);
router.post('/user/modifyInfo', userCtrl.modifyInfo);

module.exports = router;
