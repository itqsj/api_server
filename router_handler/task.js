const APIFeatures = require('../util/APIFeatures');
const { TaskPanelsModel, TaskModel } = require('../db/task');
const { awaitFn } = require('../util/awaitFn');

// 面板列表
exports.getPanelList = async (req, res) => {
    const { team_id } = req.auth;
    let { page = 1, pageSize = 10 } = req.body;

    if (!team_id) {
        return res.cc('team_id不能为空');
    }

    const skip = (page - 1) * pageSize;
    const count = await TaskPanelsModel.count();
    const panelList = await TaskPanelsModel.find({ team_id })
        .skip(skip)
        .limit(pageSize)
        .sort({ sort: 1 });

    // 2. 执行 SQL 语句成功
    res.send({
        code: 200,
        message: '获取成功！',
        data: {
            count,
            page: page - 0,
            pageSize: pageSize - 0,
            list: panelList,
        },
    });
};

// 添加面板
exports.panelAdd = async (req, res) => {
    const { name, team_id } = req.body;
    const result = await TaskPanelsModel.find({ team_id });
    const isHas = result.filter((item) => item.name === name).length;

    if (isHas) {
        return res.cc('当前名字的面板已存在！');
    }

    const inserResult = await awaitFn(
        TaskPanelsModel.insertMany({
            name,
            team_id,
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
    let NEW_INDEX = -1;
    let OLD_INDEX = -1;
    let isRise = true;
    sort = sort + 1;

    if (my_team !== team_id) {
        return res.cc('你不是属于当前团队成员，不能移动面板');
    }
    const list = await TaskPanelsModel.find({ team_id }).sort({ sort: 1 });

    if (sort > list.length) {
        sort = list.length;
    } else if (sort < 1) {
        sort = 1;
    }
    list.forEach((item, index) => {
        if (item._id.toString() === _id) {
            OLD_INDEX = index;
            isRise = item.sort > sort;
            item.sort = isRise ? sort - 0.5 : sort + 0.5;
        }
    });
    list.sort((a, b) => a.sort - b.sort);
    list.forEach((item, index) => {
        if (item._id.toString() === _id) {
            NEW_INDEX = index;
        }
        item.sort = index + 1;
    });
    if (NEW_INDEX === OLD_INDEX) {
        res.send({
            code: 200,
            message: '操作成功！',
        });
        return;
    }
    if (isRise) {
        updataList = list.filter(
            (item, index) => NEW_INDEX <= index && index <= OLD_INDEX,
        );
    } else {
        updataList = list.filter(
            (item, index) => OLD_INDEX <= index && index <= NEW_INDEX,
        );
    }

    for (let i of updataList) {
        await awaitFn(
            TaskPanelsModel.updateOne({ _id: i._id }, { sort: i.sort }),
        );
    }

    // 2. 执行 SQL 语句成功
    res.send({
        code: 200,
        message: '操作成功！',
    });
};

// 面板删除
exports.panelDel = async (req, res) => {
    const { team_id: my_team } = req.auth;
    let { _id, team_id } = req.body;
};

exports.taskAdd = async (req, res) => {
    // 2. 执行 SQL 语句成功
    res.send({
        code: 200,
        message: '获取成功！',
    });
};
