const { TaskModel } = require('../../db/task');

exports.taskAdd = async (req, res) => {
    // 2. 执行 SQL 语句成功
    res.send({
        code: 200,
        message: '获取成功！',
    });
};
