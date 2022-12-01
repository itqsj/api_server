const db = require('../db/index');
//生成token字符串
const jwt = require('jsonwebtoken');
// 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
const bcrypt = require('bcryptjs');
// 导入配置文件
const config = require('../config/config');

exports.userInfo = (req, res) => {
    const selectSql =
        'select id,username,nickname,email,user_pic from users where id = ?';
    db.query(selectSql, [req.auth.id], (err, result) => {
        if (err) {
            return res.cc(err, 500);
        }
        res.send({
            code: 200,
            msg: '获取成功！',
            data: result[0],
        });
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

function updatePwd(body, user, res) {
    const sql = 'update users set password=? where id=?';
    const newPwd = bcrypt.hashSync(body.newPwd, 10);

    db.query(sql, [newPwd, user.id], (err, result) => {
        //执行失败
        if (err) return res.cc(err, 500);
        if (result.affectedRows !== 1) res.cc('更新密码失败！');
        res.send({
            code: 200,
            msg: '更新成功！',
        });
    });
}

// 重置密码
exports.resetpwd = (req, res) => {
    const auth = req.auth;

    if (req.body.username !== auth.username)
        return res.cc('只能重置当前账号！');

    const selectSQL = 'select * from users where username=?';

    db.query(selectSQL, auth.username, (err, result) => {
        //执行失败
        if (err) return res.cc(err, 500);
        if (result.length !== 1) res.cc('该账号未注册！');
        const compareResult = bcrypt.compareSync(
            req.body.oldPwd,
            result[0].password,
        );

        if (!compareResult) {
            return res.cc('原密码错误！');
        }

        updatePwd(req.body, result[0], res);
    });
};
