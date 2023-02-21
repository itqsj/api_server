const db = require('../db/index');

//更新头像
exports.getArticleList = (req, res) => {
    let { page = 0, pageSize = 10 } = req.body;
    if (page !== 0) {
        page = page - 1;
    }
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql =
        'select * from articles where is_delete=0 order by id asc LIMIT ? OFFSET ?';
    db.query(sql, [pageSize, page], (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err);

        // 2. 执行 SQL 语句成功
        res.send({
            code: 200,
            message: '获取成功！',
            data: results,
        });
    });
};

exports.addArticle = (req, res) => {
    console.log(req.auth);
    const { id, username } = req.auth;
    const articleInfo = {
        ...req.body,
        pub_time: Date.now(),
        author_id: id,
        author_name: username,
    };
    const sql = `insert into articles set ?`;
    db.query(sql, articleInfo, (err, result) => {
        if (err) return res.cc(err, 500);
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (result.affectedRows !== 1) return res.cc('发布文章失败！');

        res.send({
            code: 200,
            msg: '发布成功',
        });
    });
};
