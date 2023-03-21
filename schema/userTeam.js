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
const name = joi.string().required();
const users = joi.array().min(1).required();

// 注册和登录表单的验证规则对象
exports.reg_teamadd_schema = {
    body: {
        name,
        users,
    },
};
