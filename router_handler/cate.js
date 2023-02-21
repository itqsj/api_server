const db = require('../db/index');

//更新头像
exports.getCateList = (req, res) => {
    let { page = 0, pageSize = 10 } = req.body;
    if (page !== 0) {
        page = page - 1;
    }
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql =
        'select * from article_cate where is_delete=0 order by id asc LIMIT ? OFFSET ?';
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

function cateInsert(req, res, isChild = false) {
    const sql = `insert into article_cate set ?`;
    db.query(sql, req.body, (err, result) => {
        // SQL 语句执行失败
        if (err) return res.cc(err);
        // SQL 语句执行成功，但是影响行数不等于 1
        if (result.affectedRows !== 1) return res.cc('新增文章分类失败！');
        if (isChild) {
            const sql = `update article_cate set has_child=1 where id=?`;
            db.query(sql, req.body.parent_id, (err, result) => {
                // SQL 语句执行失败
                if (err) return res.cc(err);
            });
        }
        // 新增文章分类成功
        res.cc({
            code: 200,
            msg: '新增分类成功！',
        });
    });
}
// 新增
exports.cateAdd = (req, res) => {
    const { name, alias, parent_id = 99 } = req.body;
    const sql = 'select * from article_cate where (name=? or alias=?)';
    db.query(sql, [name, alias], (err, result) => {
        if (err) return res.cc(err, 500);
        if (result.length) return res.cc('该分类名称或alias已存在！');
        if (parent_id !== 99) {
            const sql = 'select * from article_cate where id=?';
            db.query(sql, [parent_id], (err, result) => {
                if (err) return res.cc(err, 500);
                if (!result.length) return res.cc('该父分类不存在！');
                req.body.level = result[0].level + 1;
                const isChild = true;
                cateInsert(req, res, isChild);
            });
        } else {
            req.body.parent_id = 99;
            cateInsert(req, res);
        }
    });
};

// 删除
exports.cateDel = (req, res) => {
    const sql = 'DELETE FROM article_cate WHERE id = ?';
    db.query(sql, [req.body.id], (err, result) => {
        // SQL 语句执行失败
        if (err) return res.cc(err);
        // SQL 语句执行成功，但是影响行数不等于 1
        if (result.affectedRows !== 1) return res.cc('删除失败！');

        res.send({
            code: 200,
            msg: '删除成功',
        });
    });
};
