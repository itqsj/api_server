const express = require('express');

const router = express.Router();

const { login, regUser } = require('../router_handler/login');
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const { reg_login_schema, reg_reguser_schema } = require('../schema/user');

// 注册新用户
router.post('/reguser', expressJoi(reg_reguser_schema), regUser);
router.post('/login', expressJoi(reg_login_schema), login);

module.exports = router;
