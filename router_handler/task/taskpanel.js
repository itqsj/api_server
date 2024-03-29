const { TaskPanelsModel, TaskModel } = require('../../db/task');
const { awaitFn } = require('../../util/awaitFn');
const { move } = require('./moveFn');

// 面板列表
exports.getPanelList = async (req, res) => {
    const { team_id } = req.auth;
    let { page = 1, pageSize = 10 } = req.body;
    let list = [];

    if (!team_id) {
        return res.cc('team_id不能为空');
    }

    const skip = (page - 1) * pageSize;
    const count = await TaskPanelsModel.count();
    const panelList = await TaskPanelsModel.find({ team_id })
        .skip(skip)
        .limit(pageSize)
        .sort({ sort: 1 });
    for (let item in panelList) {
        list[item] = { ...panelList[item]._doc, tasks: [] };
        list[item].tasks = await TaskModel.find(
            {
                panel_id: panelList[item]._id,
            },
            {
                content: 0,
            },
        ).sort({ sort: 1 });
    }

    // 2. 执行 SQL 语句成功
    res.send({
        code: 200,
        message: '获取成功！',
        data: {
            count,
            page: page - 0,
            pageSize: pageSize - 0,
            list: list,
        },
    });
};

// 添加面板
exports.panelAdd = async (req, res) => {
    const { name, team_id, type } = req.body;
    const result = await TaskPanelsModel.find({ team_id });
    const isHas = result.filter(
        (item) => item.name === name || item.type === type,
    ).length;

    if (isHas) {
        return res.cc('当前名字的面板已存在！');
    }

    const inserResult = await awaitFn(
        TaskPanelsModel.insertMany({
            name,
            team_id,
            type,
            sort: result.length + 1,
        }),
    );

    if (inserResult.success) {
        // 2. 执行 SQL 语句成功
        res.send({
            code: 200,
            message: '操作成功！',
        });
    } else {
        res.cc(inserResult.err);
    }
};

// 面板移动
exports.panelMove = async (req, res) => {
    const { team_id: my_team } = req.auth;
    let updataList = [];
    let { _id, team_id, sort } = req.body;

    if (my_team !== team_id) {
        return res.cc('你不是属于当前团队成员，不能移动面板');
    }
    const list = await TaskPanelsModel.find({ team_id }).sort({ sort: 1 });
    updataList = move({ list, _id, sort });

    if (!updataList.length) {
        res.send({
            code: 200,
            message: '操作成功！',
        });
        return;
    }
    const result = await awaitFn(TaskPanelsModel.bulkWrite(updataList));
    if (result.success) {
        // 2. 执行 SQL 语句成功
        res.send({
            code: 200,
            message: '操作成功！',
        });
    } else {
        res.cc('更新失败');
    }
};

// 面板删除
exports.panelDel = async (req, res) => {
    const { team_id } = req.auth;
    let { _id } = req.body;

    const result = await awaitFn(TaskPanelsModel.deleteOne({ _id, team_id }));
    if (result.success && result.res.deletedCount > 0) {
        res.send({
            code: 200,
            message: '操作成功！',
            result,
        });
    } else {
        res.cc('没找到当前任务面板');
    }
};
