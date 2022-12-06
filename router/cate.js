const express = require('express');

const router = express.Router();

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const {
    reg_catelist_schema,
    reg_cateadd_schema,
    reg_catedel_schema,
} = require('../schema/cate');
const { getCateList, cateAdd, cateDel } = require('../router_handler/cate');

router.get('/list', expressJoi(reg_catelist_schema), getCateList);
router.post('/add', expressJoi(reg_cateadd_schema), cateAdd);
router.post('/del', expressJoi(reg_catedel_schema), cateDel);

module.exports = router;
