const express = require('express');

//user函数
const { userInfo } = require('../router_handler/user');

const router = express.Router();

router.get('/info', userInfo);

module.exports = router;
