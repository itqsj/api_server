const { TaskModel, TaskPanelsModel } = require('../../db/task');

exports.taskAdd = async (req, res) => {
    const { name, panel_id, img, content, priority } = req.body;
    const result = await TaskModel.find({ name, panel_id });
    const isHas = result.filter((item) => item.name === name).length;

    // 2. 执行 SQL 语句成功
    res.send({
        code: 200,
        message: '获取成功！',
        result,
    });
};
