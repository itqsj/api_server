const express = require('express');
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

//user函数
const { addTeam, teamList, teamRemove } = require('../router_handler/userTeam');
// 校验
const { reg_teamadd_schema } = require('../schema/userTeam');

const router = express.Router();

//添加团队
router.post('/add', expressJoi(reg_teamadd_schema), addTeam);
//获取团队列表
router.get('/list', teamList);
//删除团队
router.post('/remove', teamRemove);

module.exports = router;
