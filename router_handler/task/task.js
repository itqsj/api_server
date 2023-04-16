const { TaskModel, TaskPanelsModel } = require('../../db/task');
const UserTeamModel = require('../../db/userTeam');
const UserModel = require('../../db/user');
const { awaitFn } = require('../../util/awaitFn');
const { move, remove, add } = require('./moveFn');

exports.taskAdd = async (req, res) => {
    const { name, img, content, priority, needTime } = req.body;
    const { _id, team_id } = req.auth;
    const result = await TaskModel.find({ team_id, name });
    if (result.length) {
        res.cc('当前名称已存在');
        return;
    }
    const TaskPanel = await TaskPanelsModel.findOne({ team_id, type: 1 });
    if (!TaskPanel) {
        return res.cc('请创建待执行任务面板');
    }
    const count = await TaskModel.count({ team_id, panel_id: TaskPanel._id });

    const task = {
        name,
        panel_id: TaskPanel._id,
        team_id,
        img,
        content,
        priority,
        needTime,
        creator: _id,
        sort: count + 1,
    };
    const insertResult = await awaitFn(TaskModel.insertMany(task));

    if (insertResult.success) {
        // 2. 执行 SQL 语句成功
        res.send({
            code: 200,
            message: '操作成功！',
        });
    } else {
        res.cc(insertResult.err);
    }
};

// task列表
exports.taskList = async (req, res) => {
    const { team_id } = req.auth;
    let { page = 1, pageSize = 10, panel_id } = req.body;

    if (!team_id) {
        return res.cc('team_id不能为空');
    }
    const condition = {
        team_id,
    };
    if (panel_id) {
        condition.panel_id = panel_id;
    }

    const skip = (page - 1) * pageSize;
    const count = await TaskModel.count(condition);
    const taskList = await TaskModel.find(condition)
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
            list: taskList,
        },
    });
};

// task详情
exports.taskDetail = async (req, res) => {
    const { team_id } = req.auth;
    let { _id } = req.body;
    const task = await TaskModel.findOne({ _id, team_id });
    const team = await UserTeamModel.findById({ _id: team_id });
    const user = await UserModel.findById({ _id: task.creator });
    const data = {
        ...task._doc,
        team,
        user,
    };

    res.send({
        code: 200,
        message: '获取成功',
        data,
    });
};

// task详情
exports.taskEdit = async (req, res) => {
    const { team_id } = req.auth;
    let { _id, name, img, content, priority, needTime } = req.body;
    const task = await TaskModel.findOne({ _id, team_id });
    task.name = name;
    task.content = content;
    task.priority = priority;
    task.needTime = needTime;
    task.img = img;
    await task.save();
    res.send({
        code: 200,
        message: '操作成功',
    });
};

// task删除
exports.taskDel = async (req, res) => {
    const { team_id } = req.auth;
    let { _id } = req.body;

    const result = await awaitFn(TaskModel.deleteOne({ _id, team_id }));
    if (result.success && result.res.deletedCount > 0) {
        res.send({
            code: 200,
            message: '操作成功！',
            result,
        });
    } else {
        res.cc('当前任务不存在');
    }
};

// task移动
exports.taskMove = async (req, res) => {
    const { team_id: my_team } = req.auth;
    // type 1移动 2新增和删除（移动到另一个面版）
    let { team_id, type, data } = req.body;
    let updataList = [];
    if (team_id !== my_team) {
        return res.cc('你不是当前团队的成员不能操作');
    }
    if (type === 1) {
        const { _id, sort, panel_id } = data;
        if (!_id || !panel_id) {
            console.log(_id, sort, panel_id);
            return res.cc('操作失败');
        }
        const list = await TaskModel.find({ team_id, panel_id }).sort({
            sort: 1,
        });
        updataList = move({ list, _id, sort });
    } else if (type === 2) {
        const removeTarlist = await TaskModel.find({
            team_id,
            panel_id: data.removed.panel_id,
        }).sort({
            sort: 1,
        });
        const removeObj = remove({
            list: removeTarlist,
            _id: data.removed._id,
            sort: data.removed.sort + 1,
        });
        const addTarlist = await TaskModel.find({
            team_id,
            panel_id: data.added.panel_id,
        }).sort({
            sort: 1,
        });

        const addChangeList = add({
            list: addTarlist,
            sort: data.added.sort + 1,
        });

        const tarTask = {
            updateMany: {
                filter: { _id: removeObj.oldTask._id },
                update: {
                    sort: data.added.sort + 1,
                    panel_id: data.added.panel_id,
                },
            },
        };
        const addPanel = await TaskPanelsModel.findById(data.added.panel_id);
        const oldTask = removeTarlist.filter(
            (item) => item._id === removeObj.oldTask._id,
        )[0];

        if (addPanel.type === 3) {
            tarTask.updateMany.update.completeTime = Date.now();
        } else if (addPanel.type === 2 && !oldTask.startTime) {
            tarTask.updateMany.update.startTime = Date.now();
        }

        updataList = [...removeObj.newList, ...addChangeList, tarTask];
    }

    if (!updataList.length) {
        return res.send({
            code: 200,
            message: '操作成功！',
        });
    }

    const result = await awaitFn(TaskModel.bulkWrite(updataList));
    if (result.success) {
        // 2. 执行 SQL 语句成功
        res.send({
            code: 200,
            message: '操作成功！',
        });
    } else {
        res.cc(result.err);
    }
};
