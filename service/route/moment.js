'use strict'

const base = require('./base'); 
const momentCtrl = require('../controller/momentCtrl');
const router = base.router;

router.post('/moment/create', momentCtrl.createMoment);
router.get('/moment/getMomentList', momentCtrl.getMomentList)

module.exports = router;
