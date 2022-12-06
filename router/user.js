const express = require('express');
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

//user函数
const {
    userInfo,
    verifyToken,
    resetpwd,
    updateAvatar,
} = require('../router_handler/user');
// 校验
const {
    update_password_schema,
    reg_getuser_schema,
    reg_verify_schema,
    reg_avatar_schema,
} = require('../schema/user');

const router = express.Router();

// 获取用户信息
router.post('/info', expressJoi(reg_getuser_schema), userInfo);
router.post('/verifyToken', expressJoi(reg_verify_schema), verifyToken);
//重置密码
router.post('/resetpwd', expressJoi(update_password_schema), resetpwd);
//修改头像
router.post('/upAvatar', expressJoi(reg_avatar_schema), updateAvatar);

module.exports = router;
