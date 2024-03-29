const express = require('express');
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

//user函数
const {
    getUserInfo,
    verifyToken,
    resetpwd,
    updateAvatar,
    updateBg,
    getUserList,
    updateInfo,
} = require('../router_handler/user');
// 校验
const {
    update_password_schema,
    reg_verify_schema,
    reg_avatar_schema,
    reg_bg_schema,
    reg_getuserlist_schema,
} = require('../schema/user');

const router = express.Router();

//获取用户列表
router.get('/list', expressJoi(reg_getuserlist_schema), getUserList);
// 获取用户信息
router.get('/info', getUserInfo);
router.post('/verifyToken', expressJoi(reg_verify_schema), verifyToken);
//重置密码
router.post('/resetpwd', expressJoi(update_password_schema), resetpwd);
//修改头像
router.post('/upAvatar', expressJoi(reg_avatar_schema), updateAvatar);
//修改背景
router.post('/bg', expressJoi(reg_bg_schema), updateBg);
//修改信息
router.post('/updateInfo', updateInfo);

module.exports = router;
