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

// task
const name = joi.string().required();
const _id = joi.string().required(); //上一层id
const img = joi.string().allow('');
const schedule = joi.number().min(0).max(1).required(); //任务进度（百分比）
const startTime = joi.date().allow(''); //任务开始时间
const completeTime = joi.date().required();
const planCompleteTime = joi.date().allow('');
const sort = joi.number().required();
const priority = joi.number().valid(1, 2, 3).required(); //优先级

exports.reg_taskadd_schema = {
    body: {
        name,
        panel_id: _id,
        img,
        schedule,
        startTime,
        completeTime,
        planCompleteTime,
        sort,
        priority,
    },
};

// taskPanel
const taskPanelName = joi.string().required();
const team_id = joi.string().required(); //上一层id
const sortPanel = joi.number().required();

exports.reg_taskPaneladd_schema = {
    body: {
        name: taskPanelName,
        team_id,
    },
};

exports.reg_taskPanelmove_schema = {
    body: {
        _id,
        team_id,
        sort: sortPanel,
    },
};
