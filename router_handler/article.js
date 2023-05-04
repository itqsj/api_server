const ArticleModel = require('../db/article');
const CateModel = require('../db/cate');
const APIFeatures = require('../util/APIFeatures');
const { awaitFn } = require('../util/awaitFn');

exports.getArticleList = async (req, res) => {
    const {
        page = 1,
        pageSize = 10,
        author_id,
        not_id,
        keyWord,
        timeRang,
        cateIds,
    } = req.query;
    const filter = {};
    // const indexes = {};
    if (timeRang && timeRang.length) {
        const rang = {};
        if (timeRang[0] !== '0') {
            rang.$gte = timeRang[0] - 0;
        }
        if (timeRang[1] !== '0') {
            rang.$lte = timeRang[1] - 0;
        }
        if (timeRang[0] !== '0' || timeRang[1] !== '0') {
            if (timeRang[0] > timeRang[1] && timeRang[1] !== '0') {
                return res.cc('结束时间不能小于开始时间');
            }
            // indexes.pub_time = -1;
            filter.pub_time = rang;
        }
    }
    if (author_id) {
        filter.author_id = author_id;
        // indexes.author_id = author_id;
    }
    if (not_id) {
        filter._id = { $ne: not_id };
    }
    if (keyWord) {
        filter.$or = [];
        filter.$or.push({ title: { $regex: keyWord, $options: 'i' } });
        filter.$or.push({ introduce: { $regex: keyWord, $options: 'i' } });
        // indexes.title = keyWord;
        // indexes.introduce = keyWord;
    }
    if (cateIds && cateIds.length) {
        filter.cate_id = { $in: cateIds };
        // indexes.cate_id = 1;
    }

    // ArticleModel.createIndexes(indexes);
    const aaa = await ArticleModel.listIndexes();
    console.log(aaa);

    const features = new APIFeatures(
        ArticleModel.find(filter, {
            content: 0,
        }).sort({ pub_time: -1 }),
        req.query,
    ).paginate();

    const articleList = await features.query;
    const count = await ArticleModel.count(filter);

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

exports.getArticleDetail = async (req, res) => {
    const { _id } = req.query;
    if (!_id) return res.cc('_id不能为空');

    const article = await ArticleModel.findById({ _id });
    const cate = await CateModel.findById({ _id: article.cate_id });
    article.cate = cate;
    const data = {
        ...article._doc,
        cate,
    };
    res.send({
        code: 200,
        message: '获取成功！',
        data,
    });
};

exports.articleEdit = async (req, res) => {
    const { _id: myId } = req.auth;
    const { _id } = req.body;

    const article = await ArticleModel.findById({ _id });

    if (myId !== article.author_id.toString())
        return res.cc('只能编辑自己的文章');

    const keys = Object.keys(req.body);
    keys.forEach((item) => {
        if (item !== _id) {
            article[item] = req.body[item];
        }
    });
    await article.save();

    res.send({
        code: 200,
        message: '操作成功！',
    });
};

exports.articleDel = async (req, res) => {
    const { _id: myId } = req.auth;
    const { _id } = req.body;
    const tar = await ArticleModel.findById(_id);
    if (tar.author_id.toString() !== myId) {
        return res.cc('不能删除他人的文章');
    }
    const result = await awaitFn(ArticleModel.deleteOne({ _id }));

    if (result.success && result.res.deletedCount > 0) {
        res.send({
            code: 200,
            message: '操作成功！',
        });
    } else {
        res.cc('当前id不存在');
    }
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
