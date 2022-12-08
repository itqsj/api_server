const express = require('express');

const router = express.Router();

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const {
    reg_articlelist_schema,
    reg_articleadd_schema,
} = require('../schema/article');
const { getArticleList, addArticle } = require('../router_handler/article');

router.get('/list', expressJoi(reg_articlelist_schema), getArticleList);
router.get('/add', expressJoi(reg_articleadd_schema), addArticle);

module.exports = router;
