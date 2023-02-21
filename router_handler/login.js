// const path = require('path');
const UserModel = require('../db/user');
const bcryptjs = require('bcryptjs');

exports.login = async (req, res) => {
    //获取定位
    // const geoip = require('geoip-lite');
    // var ip =
    //     req.headers['x-forwarded-for'] ||
    //     req.ip ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress ||
    //     req.connection.socket.remoteAddress ||
    //     '';
    // if (ip.split(',').length > 0) {
    //     ip = ip.split(',')[0];
    // }
    // ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
    // // const ip = '116.30.228.32';

    // var geo = geoip.lookup(ip);
    // console.log(ip, geo);

    const { email, password } = req.body;

    const result = await UserModel.findOne({ email }).select('+password');

    if (!result) res.cc('该邮箱还未注册！', 400);

    const compareResult = bcryptjs.compareSync(password, result.password);

    if (!compareResult) res.cc('密码错误！请重试', 400);

    const token = 'Bearer ' + result.generateToken();
    res.send({
        code: 200,
        msg: '登录成功！',
        token: token,
    });
};

// 注册用户的处理函数s
exports.regUser = async (req, res) => {
    const { username } = req.body;
    const user = await UserModel.findOne({ username });

    if (user) return res.cc('该用户名已存在！', 400);
    const newUser = new UserModel(req.body);
    newUser
        .save()
        .then(() => {
            res.send({ code: 200, message: '注册成功！' });
        })
        .catch((err) => {
            return res.cc(err, 400);
        });
};
