const UserTeamModel = require('../db/userTeam');
const APIFeatures = require('../util/APIFeatures');

const { awaitFn } = require('../util/awaitFn');

// 添加
exports.addTeam = async (req, res) => {
    const { name, users } = req.body;

    const team = await UserTeamModel.findOne({ name });

    if (team) {
        return res.cc('当前团名名字重复！');
    }
    const newUsers = Array.from(new Set(users));
    await UserTeamModel.insertMany({ name, users: newUsers })
        .then((_) => {
            res.send({
                code: 200,
                message: '操作成功！',
            });
        })
        .catch((err) => {
            if (err) {
                return res.cc(err);
            }
        });
};

//
exports.teamList = async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;

    const features = new APIFeatures(
        UserTeamModel.find(),
        req.query,
    ).paginate();

    const list = await features.query;
    const count = await UserTeamModel.count();

    res.send({
        code: 200,
        message: '获取成功！',
        data: {
            count,
            page: page - 0,
            pageSize: pageSize - 0,
            list,
        },
    });
};

// 获取账号团队
// exports.teamList = async (req, res) => {
//     const { userId } = req.query;

//     UserTeamModel.find({});

//     res.send({
//         code: 200,
//         message: '获取成功！',
//         data: {},
//     });
// };

// 删除
exports.teamRemove = async (req, res) => {
    const { _id } = req.body;

    const result = await awaitFn(UserTeamModel.deleteOne({ _id }));

    if (result.success && result.res.deletedCount > 0) {
        res.send({
            code: 200,
            message: '操作成功！',
        });
    } else {
        res.cc('当前id不存在');
    }
};
