const db = require('../db/index');

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
