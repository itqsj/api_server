const express = require('express');

const router = express.Router();

const { login, regUser } = require('../router_handler/api');
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/sso');

// 注册新用户
router.post('/reguser', expressJoi(reg_login_schema), regUser);
router.post('/login', expressJoi(reg_login_schema), login);

module.exports = router;
