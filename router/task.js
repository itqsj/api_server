const express = require('express');

const router = express.Router();

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 2. 导入需要的验证规则对象
const {
    reg_taskadd_schema,
    reg_taskPaneladd_schema,
    reg_taskPanelmove_schema,
    reg_taskdel_schema,
    reg_taskamove_schema,
    reg_taskedit_schema,
} = require('../schema/task');
const {
    getPanelList,
    panelAdd,
    panelMove,
    panelDel,
} = require('../router_handler/task/taskpanel');
const {
    taskAdd,
    taskList,
    taskDel,
    taskMove,
    taskDetail,
    taskEdit,
} = require('../router_handler/task/task');

router.post('/panel_list', getPanelList);
router.post('/panel_add', expressJoi(reg_taskPaneladd_schema), panelAdd);
router.post('/panel_move', expressJoi(reg_taskPanelmove_schema), panelMove);
router.post('/panel_del', expressJoi(reg_taskdel_schema), panelDel);

router.post('/detail', expressJoi(reg_taskdel_schema), taskDetail);
router.post('/add', expressJoi(reg_taskadd_schema), taskAdd);
router.post('/edit', expressJoi(reg_taskedit_schema), taskEdit);
router.post('/list', taskList);
router.post('/del', expressJoi(reg_taskdel_schema), taskDel);
router.post('/move', expressJoi(reg_taskamove_schema), taskMove);

module.exports = router;
