// 导入 express 模块
const express = require('express');
// 导入 cors 中间件
const cors = require('cors');
// 创建 express 的服务器实例
const app = express();
const loginRouter = require('./router/login');
const userRouter = require('./router/user');
const teamRouter = require('./router/userTeam');
const cateRouter = require('./router/cate');
const articleRouter = require('./router/article');
const taskRouter = require('./router/task');
const upload = require('./router/upload');
const joi = require('joi');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config({
    path: './.env',
});

// eslint-disable-next-line no-undef
app.use(express.static(__dirname + '/public', { index: 'index.html' }));

//解析token的中间件
const { expressjwt: jwt } = require('express-jwt');

app.use(
    cors({
        origin: [
            'http://10.10.30.124',
            'https://web-blog-7xuib6z3o-itqsj.vercel.app',
        ],
        credentials: true,
    }),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
// 响应数据的中间件
app.use((req, res, next) => {
    // status = 200 为成功； status = 500 为服务端失败；status = 400 为客户端失败； 默认将 status 的值设置为 500，方便处理失败的情况
    res.cc = (err, code = 400) => {
        res.send({
            // 状态
            code,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err,
        });
    };
    res.selectErr = (err, result, message = '查询失败！') => {
        if (err) {
            res.cc(err, 500);
            return false;
        }
        if (result.length !== 1) {
            res.cc(message, 400);
            return false;
        }

        return true;
    };

    res.updateErr = (err, result, message = '更新失败！') => {
        if (err) {
            res.cc(err, 500);
            return false;
        }
        if (result.affectedRows !== 1) {
            res.cc(message, 400);
            return false;
        }

        return true;
    };
    next();
});

app.use(
    jwt({
        secret: process.env.JWTSECRETKEY,
        algorithms: ['HS256'],
    }).unless({ path: [/^\/lg\//, /^\/public\//] }),
);

app.use((req, res, next) => {
    if (req.url.includes('/lg')) {
        return next();
    }

    const authMap = {
        // user
        '/user/list': false,
        '/user/info': false,
        '/user/verifyToken': false,
        '/user/resetpwd': false,
        '/user/updateInfo': false,
        // team
        '/team/add': true,
        '/team/list': false,
        '/team/remove': true,
        // cate
        '/cate/list': false,
        '/cate/add': true,
        '/cate/del': true,
        // article
        '/article/list': false,
        '/article/detail': false,
        '/article/add': true,
        '/article/edit': true,
        '/article/del': true,
        // task
        '/task/panel_list': false,
        '/task/panel_add': true,
        '/task/panel_move': true,
        '/task/panel_del': true,
        '/task/detail': false,
        '/task/add': true,
        '/task/edit': true,
        '/task/list': false,
        '/task/del': true,
        '/task/move': true,
        // upload
        '/upload/file': true,
    };
    if (!authMap[req.url]) {
        next();
    } else {
        const { isAdmin } = req.auth;
        if (isAdmin) {
            next();
        } else {
            return res.cc('当前账号没有权限，请联系管理员。');
        }
    }
});

app.use('/public', express.static('./uploads')); //可以通过服务器地址+pubilc+加文件夹访问静态文件
app.use('/lg', loginRouter);
app.use('/user', userRouter);
app.use('/team', teamRouter);
app.use('/cate', cateRouter);
app.use('/article', articleRouter);
app.use('/task', taskRouter);
app.use('/upload', upload); //上传图片文件等
//错误中间件
app.use((err, req, res) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err);
    //身份认证失败！
    if (err.name === 'UnauthorizedError')
        return res.cc('当前网络繁忙，请稍候重试 token 失效 4004', 4004);
    // 未知错误
    res.cc(err);
});

module.exports = app;
