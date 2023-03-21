const mongoose = require('mongoose');
// const validator = require('validator');

const Schema = mongoose.Schema;

const UserTeamSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: [true, 'name不能为空'],
    },
    users: {
        type: [Schema.ObjectId],
        required: [true, 'users不能为空'],
        ref: 'user',
    },
    create_at: {
        type: Date,
        default: Date.now(),
    },
});

const UserTeamModel = mongoose.model('userTeam', UserTeamSchema);
module.exports = UserTeamModel;
