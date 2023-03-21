const mongoose = require('mongoose');
const validate = require('validator');

const Schema = mongoose.Schema;

const CateSchema = new Schema({
    _id: Schema.Types.ObjectId,
    parent_id: {
        type: String,
        required: [true, '父分类id不能为空'],
    },
    name: {
        type: String,
        required: [true, '分类名不能为空'],
    },
    alias: {
        type: String,
        required: [true, '分类别名不能为空'],
    },
    level: {
        type: Number,
        required: [true, '分类级别不能为空'],
    },
    pub_time: {
        type: Number,
        default: Date.now(),
    },
});

const CateModel = mongoose.model('cate', CateSchema);
module.exports = CateModel;
