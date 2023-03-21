const mongoose = require('mongoose');
// const validate = require('validator');

const Schema = mongoose.Schema;

const TaskPanelsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    type: {
        //面板类型
        //1 待执行 2.进行中 3已完成 4需复习
        type: Number,
        require: [true, 'type不能为空'],
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
});

const TaskSchema = new Schema({
    _id: Schema.Types.ObjectId,
    panel_id: {
        type: Schema.ObjectId,
        required: [true, 'panel_id不能为空'],
        ref: 'taskPanels',
    },
    name: {
        type: String,
        required: [true, 'name不能为空'],
    },
    img: {
        type: String,
        required: false,
    },
    startTime: {
        type: Date,
        required: false,
    },
    completeTime: {
        type: Date,
        required: [false],
    },
    planCompleteTime: {
        type: Date,
        required: [false],
    },
    sort: {
        type: Number,
        required: [true, 'sort不能为空'],
    },
    priority: {
        type: Number, //1高，2较高，3低
        required: [true, 'priority不能为空'],
    },
});

const TaskPanelsModel = mongoose.model('taskPanels', TaskPanelsSchema);
const TaskModel = mongoose.model('task', TaskSchema);
module.exports = {
    TaskPanelsModel,
    TaskModel,
};
