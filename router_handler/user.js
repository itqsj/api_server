//生成token字符串
const jwt = require('jsonwebtoken');
// 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
// 导入配置文件
const config = require('../config/config');

const APIFeatures = require('../util/APIFeatures');
const UserModel = require('../db/user');
const UserTeamModel = require('../db/userTeam');

exports.getUserList = async (req, res) => {
    const { page = 1, pageSize = 10, ids = [] } = req.query;
    const filter = {};
    if (ids.length) {
        filter._id = { $in: ids };
    }
    const features = new APIFeatures(UserModel.find(filter), req.query)
        .paginate()
        .sort();
    const users = await features.query;
    const count = await UserModel.count();

    res.send({
        code: 200,
        message: '获取成功！',
        data: {
            count,
            page: page - 0,
            pageSize: pageSize - 0,
            users,
        },
    });
};

exports.getUserInfo = async (req, res) => {
    const { _id } = req.auth;
    const info = await UserModel.findOne({ _id });
    const team = await UserTeamModel.findOne({
        users: { $elemMatch: { $eq: `${_id}` } },
    });

    res.send({
        code: 200,
        data: {
            ...info._doc,
            team,
        },
    });
};

exports.verifyToken = (req, res) => {
    const token = req.body.token.split('Bearer ')[1];

    jwt.verify(token, config.jwtSecretKey, function (err, decoded) {
        if (err) {
            res.cc('当前网络繁忙，请稍候重试 token 失效 4004', 4004);
        } else {
            // 生成 Token 字符串
            const tokenStr = jwt.sign(decoded, config.jwtSecretKey);
            res.send({
                code: 200,
                data: {
                    token: 'Bearer ' + tokenStr,
                    ...req.auth,
                },
            });
        }
    });
};

// 重置密码
exports.resetpwd = async (req, res) => {
    const { email } = req.auth;

    if (req.body.email !== email) return res.cc('只能重置当前账号！');

    const resetUser = await UserModel.findOne({ email }).select('+password');

    if (!resetUser) res.cc('该账号未注册！');

    const compareResult = await resetUser.validatePassword(
        req.body.oldPwd,
        resetUser.password,
    );

    if (!compareResult) return res.cc('密码错误！');

    resetUser.password = req.body.newPwd;
    await resetUser.save();

    res.send({
        code: 200,
        message: '操作成功！',
    });
};

//更新信息
exports.updateInfo = async (req, res) => {
    const { username, email, user_pic, background, introduction } = req.body;
    const { _id } = req.auth;

    const tarUser = await UserModel.findById(_id);
    if (!tarUser) return res.cc(`没有id为${_id}的用户！`);

    if (username) {
        tarUser.username = username;
    }
    // if (email) {
    //     tarUser.email = email;
    // }
    if (user_pic) {
        tarUser.user_pic = user_pic;
    }
    if (background) {
        tarUser.background = background;
    }
    if (introduction) {
        tarUser.introduction = introduction;
    }

    tarUser
        .save()
        .then(() => {
            res.send({
                code: 200,
                message: '更新成功！',
            });
        })
        .catch((err) => {
            res.cc(err, 500);
        });
};

//更新头像
exports.updateAvatar = async (req, res) => {
    const { _id, user_pic } = req.body;
    const tarUser = await UserModel.findById(_id);
    if (!tarUser) res.cc(`没有id为${_id}的用户！`);

    tarUser.user_pic = user_pic;
    tarUser
        .save()
        .then(() => {
            res.send({
                code: 200,
                message: '更新成功！',
            });
        })
        .catch((err) => {
            res.cc(err, 500);
        });
};

//更新背景
exports.updateBg = async (req, res) => {
    const { _id, background } = req.body;
    const tarUser = await UserModel.findById(_id);
    if (!tarUser) res.cc(`没有id为${_id}的用户！`);

    tarUser.background = background;
    tarUser
        .save()
        .then(() => {
            res.send({
                code: 200,
                message: '更新成功！',
            });
        })
        .catch((err) => {
            res.cc(err, 500);
        });
};
