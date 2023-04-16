const mongoose = require('mongoose');
// const validate = require('validator');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: [true, '标题不能为空'],
    },
    cate_id: {
        type: Schema.ObjectId,
        required: [true, '文章分类不能为空'],
        ref: 'cate',
    },
    content: {
        type: String,
        required: [true, '内容不能为空'],
    },
    introduce: {
        type: String,
        required: [true, '介绍不能为空'],
    },
    state: {
        type: String,
        required: [true, '状态不能为空'],
        enum: ['1', '2', '3'], //1 已上线, 2 '草稿' 3已下线
    },
    cover_img: {
        type: Array,
        required: [false, '图片不能为空'],
    },
    tags: {
        type: Array,
        required: [false, 'tag不能为空'],
    },
    pub_time: {
        type: Number,
        default: Date.now(),
    },
    author_id: {
        type: Schema.ObjectId,
        ref: 'user',
        required: [true, '作者不能为空不能为空'],
    },
    author_name: {
        type: String,
        required: [true, '作者名不能为空不能为空'],
    },
});

const ArticleModel = mongoose.model('article', ArticleSchema);
module.exports = ArticleModel;
