const db = require('../db/index');
//生成token字符串
const jwt = require('jsonwebtoken');
// 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
// compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
const bcrypt = require('bcryptjs');
// 导入配置文件
const config = require('../config/config');

exports.getUserList = (req, res) => {
    let { page = 0, pageSize = 10 } = req.body;
    if (page !== 0) {
        page = page - 1;
    }
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql =
        'select id,username,nickname,email,user_pic,background from users order by id asc LIMIT ? OFFSET ?';
    db.query(sql, [pageSize, page], (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);
        const selectCount = 'select count (*) from users';
        db.query(selectCount, [], (err, result) => {
            // 1. 执行 SQL 语句失败
            if (err) return res.cc(err);
            // 2. 执行 SQL 语句成功
            res.send({
                status: 200,
                message: '获取成功！',
                data: {
                    count: result[0]['count (*)'],
                    page: page + 1,
                    pageSize,
                    list: results,
                },
            });
        });
    });
};

exports.userInfo = (req, res) => {
    const selectSql =
        'select id,username,nickname,email,user_pic,background from users where id = ?';
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

//更新头像
exports.updateAvatar = (req, res) => {
    const { id, avatar } = req.body;
    const sql = 'select * from users where id=?';
    db.query(sql, [id], (err, result) => {
        const valid = res.selectErr(err, result, `没有id为${id}的用户！`);
        if (!valid) {
            return false;
        }
        const sql = 'update users set user_pic=? where id=?';

        db.query(sql, [avatar, id], (err, result) => {
            //执行失败
            const valid = res.updateErr(err, result, '更新头像失败！');
            if (!valid) {
                return false;
            }
            res.send({
                code: 200,
                msg: '更新成功！',
            });
        });
    });
};

//更新背景
exports.updateBg = (req, res) => {
    const { id, background } = req.body;
    const sql = 'select * from users where id=?';
    db.query(sql, [id], (err, result) => {
        const valid = res.selectErr(err, result, `没有id为${id}的用户！`);
        if (!valid) {
            return false;
        }
        const sql = 'update users set background=? where id=?';

        db.query(sql, [background, id], (err, result) => {
            //执行失败
            const valid = res.updateErr(err, result, '更新背景失败！');
            if (!valid) {
                return false;
            }
            res.send({
                code: 200,
                msg: '更新成功！',
            });
        });
    });
};
