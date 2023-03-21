const ArticleModel = require('../db/article');
const APIFeatures = require('../util/APIFeatures');

exports.getArticleList = async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const features = new APIFeatures(ArticleModel.find(), req.query)
        .paginate()
        .sort();

    const articleList = await features.query;
    const count = await ArticleModel.count();

    res.send({
        code: 200,
        message: '获取成功！',
        data: {
            count,
            page: page - 0,
            pageSize: pageSize - 0,
            list: articleList,
        },
    });
};

exports.addArticle = async (req, res) => {
    const { _id, username } = req.auth;

    const articleInfo = {
        ...req.body,
        pub_time: Date.now(),
        author_id: _id,
        author_name: username,
    };

    ArticleModel.insertMany(articleInfo).then(
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
};
