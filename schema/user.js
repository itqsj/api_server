const joi = require('joi');

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */
// .string()：数据必须为字符串类型
// .number()：数据必须为数字类型
// .integer()：数据必须为整数类型
// .alphanum()：数据只能包含[a-zA-Z0-9]的字符
// .max(number|string)：number：最大长度 | string：最大日期
// .min(number|string)：number：最小长度 | string：最小日期
// .required()：数据为必填项，不能为null或undefined
// .pattern(正则表达式)：以正则表达式的形式验证数据
// .regex(正则表达式)：定义字段必须匹配正则规则。
// .email()：验证邮箱
// .joi.ref(key:string)：引言同辈的键值，就是拿到value
// .not(values:any[])：当前属性的值不能同参数值相同
// .valid(...values:any[])：当前属性的值必须于参数值相同
// .dataUri()：当前字段为可以是URL地址
// .allow(...values:any[])：该字段允许为指定参数的值
// .default(any[])：设置该字段的默认值，值可以为string、number、boolean……等
const _id = joi.string().required();
const page = joi.number();
const pageSize = joi.number();
const username = joi.string().alphanum().min(4).max(12).required();
const password = joi
    .string()
    .pattern(/^[\S]{6,12}$/)
    .required();
// const email = joi.string().regex('^w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$');
const email = joi.string().required();
const token = joi.string().required();
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const user_pic = joi.string().required();
const background = joi.string().required();
const introduction = joi.string().required();

exports.reg_getuserlist_schema = {
    body: {
        page,
        pageSize,
    },
};

// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
    body: {
        email,
        password,
    },
};

//注册
exports.reg_reguser_schema = {
    body: {
        username,
        password,
        email,
        user_pic,
        background,
        introduction,
    },
};

// 获取用户信息
exports.reg_getuser_schema = {
    body: {
        _id,
    },
};

// 效验token
exports.reg_verify_schema = {
    body: {
        token,
    },
};

// 重置密码校验
exports.update_password_schema = {
    body: {
        email,
        oldPwd: password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
};

// 更新头像
exports.reg_avatar_schema = {
    body: {
        _id,
        user_pic,
    },
};

// 更新背景
exports.reg_bg_schema = {
    body: {
        _id,
        background,
    },
};
