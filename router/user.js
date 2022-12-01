const express = require('express');

//user函数
const { userInfo, verifyToken } = require('../router_handler/user');

const router = express.Router();

router.get('/info', userInfo);
router.post('/verifyToken', verifyToken);

module.exports = router;
