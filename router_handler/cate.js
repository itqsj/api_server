const db = require('../db/index');
const CateModel = require('../db/cate');
const APIFeatures = require('../util/APIFeatures');

exports.getCateList = async (req, res) => {
    let { page = 1, pageSize = 10 } = req.query;

    const features = new APIFeatures(CateModel.find(), req.query)
        .paginate()
        .sort();

    const cateList = await features.query;
    const count = await CateModel.count();

    // 2. 执行 SQL 语句成功
    res.send({
        code: 200,
        message: '获取成功！',
        data: {
            count,
            page: page - 0,
            pageSize: pageSize - 0,
            list: cateList,
        },
    });
};

function cateInsert(req, res) {
    CateModel.insertMany(req).then(
        () => {
            res.send({
                code: 200,
                message: '操作成功！',
            });
        },
        (err) => {
            res.send({
                code: 301,
                message: err,
            });
        },
    );
}
// 新增
exports.cateAdd = async (req, res) => {
    const { name, alias, parent_id = '99' } = req.body;
    let level = 1;

    const cate = await CateModel.findOne({
        $or: [{ name }, { alias }],
    });

    if (cate) return res.cc('该分类名称或alias已存在！');

    if (parent_id !== '99') {
        CateModel.findOne({ _id: parent_id }).then(
            (cate) => {
                console.log(cate);
                level = cate.level + 1;
                cateInsert(
                    {
                        name,
                        alias,
                        parent_id,
                        level,
                    },
                    res,
                );
            },
            (err) => {
                return res.cc(err);
            },
        );
    } else {
        cateInsert(
            {
                name,
                alias,
                parent_id,
                level,
            },
            res,
        );
    }
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
            message: '删除成功',
        });
    });
};
