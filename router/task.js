const express = require('express');

const router = express.Router();

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const {
    reg_taskadd_schema,
    reg_taskPaneladd_schema,
    reg_taskPanelmove_schema,
} = require('../schema/task');
const {
    taskAdd,
    getPanelList,
    panelAdd,
    panelMove,
} = require('../router_handler/task');

router.post('/panel_list', getPanelList);
router.post('/panel_add', expressJoi(reg_taskPaneladd_schema), panelAdd);
router.post('/panel_move', expressJoi(reg_taskPanelmove_schema), panelMove);

router.post('/task_add', expressJoi(reg_taskadd_schema), taskAdd);

module.exports = router;
