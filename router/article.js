const express = require('express');

const router = express.Router();

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const {
    reg_articlelist_schema,
    reg_articleadd_schema,
    reg_articleedit_schema,
    reg_articledel_schema,
} = require('../schema/article');
const {
    getArticleList,
    addArticle,
    articleEdit,
    getArticleDetail,
    articleDel,
} = require('../router_handler/article');

router.get('/list', getArticleList);
router.get('/detail', getArticleDetail);
router.post('/add', expressJoi(reg_articleadd_schema), addArticle);
router.post('/edit', expressJoi(reg_articleedit_schema), articleEdit);
router.post('/del', expressJoi(reg_articledel_schema), articleDel);

module.exports = router;
