const express = require('express');

const router = express.Router();

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const {
    reg_taskadd_schema,
    reg_taskPaneladd_schema,
    reg_taskPanelmove_schema,
    reg_taskPaneldel_schema,
} = require('../schema/task');
const {
    getPanelList,
    panelAdd,
    panelMove,
    panelDel,
} = require('../router_handler/task/taskpanel');
const { taskAdd } = require('../router_handler/task/task');

router.post('/panel_list', getPanelList);
router.post('/panel_add', expressJoi(reg_taskPaneladd_schema), panelAdd);
router.post('/panel_move', expressJoi(reg_taskPanelmove_schema), panelMove);
router.post('/panel_del', expressJoi(reg_taskPaneldel_schema), panelDel);

router.post('/add', expressJoi(reg_taskadd_schema), taskAdd);

module.exports = router;
