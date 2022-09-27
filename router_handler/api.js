// const path = require('path');
const db = require('../db/index');
const bcryptjs = require('bcryptjs');
//生成token字符串
const jwt = require('jsonwebtoken');
// 导入配置文件
const config = require('../config/config');

exports.login = (req, res) => {
    const userinfo = req.body;
    const sql = `select * from users where username=?`;
    db.query(sql, userinfo.username, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err);
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败！');
        // TODO：判断用户输入的登录密码是否和数据库中的密码一致

        const compareResult = bcryptjs.compareSync(
            userinfo.password,
            results[0].password,
        );

        if (!compareResult) {
            return res.cc('账号或密码错误！');
        }
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = { ...results[0], password: '', user_pic: '' };

        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h', // token 有效期为 10 个小时
        });

        res.send({
            status: 200,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr,
        });
    });
};

// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body;
    // 判断数据是否合法
    if (!userinfo.username || !userinfo.password) {
        return res.send({ status: 1, message: '用户名或密码不能为空！' });
    }

    //查询是否存在
    const selectSql = 'select * from users where username=?';
    db.query(selectSql, userinfo.username, (err, result) => {
        if (err) {
            return res.cc(err);
        }

        if (result.length > 1) {
            return res.cc('该用户名已经被占用，请更换其他用户名！');
        }

        userinfo.password = bcryptjs.hashSync(userinfo.password, 10);

        const addUser = 'insert into users set ?';
        db.query(addUser, userinfo, (err, result) => {
            if (err) {
                return res.cc(err);
            }

            if (result.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试！');
            }

            // 注册成功
            res.send({ status: 200, message: '注册成功！' });
        });
    });
};
