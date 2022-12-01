const db = require('../db/index');
//生成token字符串
const jwt = require('jsonwebtoken');
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
