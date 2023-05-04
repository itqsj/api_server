const mongoose = require('mongoose');
// const validate = require('validator');

const Schema = mongoose.Schema;

const TaskPanelsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    type: {
        //面板类型
        //1 待执行 2.进行中 3已完成 4需复习
        type: Number,
        required: [true, 'type不能为空'],
    },
    team_id: {
        type: Schema.ObjectId,
        required: [true, 'team_id不能为空'],
        ref: 'userTeam',
    },
    name: {
        type: String,
        required: [true, '标题不能为空'],
    },
    sort: {
        type: Number,
        required: [true, '标题不能为空'],
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'user',
        required: [true, 'user不能为空'],
    },
    creator_at: {
        type: Number,
        default: Date.now(),
        required: [true, 'user不能为空'],
    },
});

const TaskSchema = new Schema({
    _id: Schema.Types.ObjectId,
    panel_id: {
        type: Schema.ObjectId,
        required: [true, 'panel_id不能为空'],
        ref: 'taskPanels',
    },
    team_id: {
        type: Schema.ObjectId,
        required: [true, 'team_id不能为空'],
        ref: 'userTeam',
    },
    name: {
        type: String,
        required: [true, 'name不能为空'],
    },
    imgs: {
        type: String,
        required: false,
    },
    completeTime: {
        type: Number,
        required: [false],
    },
    needTime: {
        type: Number,
        required: [true, 'needTime不能为空'],
    },
    usageTime: {
        type: [[Number]],
        default: [],
        required: [true, 'needTime不能为空'],
    },
    content: {
        type: String,
        required: [true, 'content不能为空'],
    },
    sort: {
        type: Number,
        required: [true, 'sort不能为空'],
    },
    priority: {
        type: Number, //1高，2较高，3低
        required: [true, 'priority不能为空'],
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'user',
        required: [true, 'user不能为空'],
    },
    creator_at: {
        type: Number,
        default: Date.now(),
        required: [true, 'user不能为空'],
    },
});

const TaskPanelsModel = mongoose.model('taskPanels', TaskPanelsSchema);
const TaskModel = mongoose.model('task', TaskSchema);
module.exports = {
    TaskPanelsModel,
    TaskModel,
};
