const express = require('express');
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

//user函数
const { userInfo, verifyToken, resetpwd } = require('../router_handler/user');
// 校验
const { update_password_schema } = require('../schema/user');

const router = express.Router();

// 获取用户信息
router.post('/info', userInfo);
router.post('/verifyToken', verifyToken);
//重置密码
router.post('/resetpwd', expressJoi(update_password_schema), resetpwd);

module.exports = router;
