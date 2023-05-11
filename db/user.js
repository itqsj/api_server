const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// 导入配置文件
const config = require('../config/config');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: {
        minlength: 3,
        type: String,
        required: [true, '用户名不能为空'],
    },
    password: {
        type: String,
        minlength: 6,
        select: false,
        required: [true, '密码不能为空'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, '邮箱格式不正确'],
        validate: [validator.isEmail, '邮箱格式不正确'],
    },
    user_pic: {
        type: String,
        required: [true, '头像不能为空'],
    },
    background: {
        type: String,
        required: [true, '背景不能为空'],
    },
    introduction: {
        type: String,
        required: [true, '介绍不能为空'],
    },
    createdAt: {
        type: String,
        default: Date.now(),
    },
    isAdmin: {
        type: Number,
        required: false,
        default: 0,
        enum: [0, 1], //1 是管理员, 0不是管理员
    },
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

UserSchema.methods.validatePassword = async function (
    inputPassword,
    userPassword,
) {
    return await bcrypt.compareSync(inputPassword, userPassword);
};

UserSchema.methods.generateToken = function (team_id) {
    const obj = {
        _id: this._id,
        username: this.username,
        email: this.email,
        isAdmin: this.isAdmin,
        team_id,
    };
    const token = jwt.sign(obj, config.jwtSecretKey, {
        expiresIn: '1h',
    });

    return token;
};
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
