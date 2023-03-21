// 导入 express 模块
const express = require('express');
// 导入 cors 中间件
const cors = require('cors');
// 创建 express 的服务器实例
const app = express();
//引入数据库
require('./db/index');

const loginRouter = require('./router/login');
const userRouter = require('./router/user');
const teamRouter = require('./router/userTeam');
const cateRouter = require('./router/cate');
const articleRouter = require('./router/article');
const taskRouter = require('./router/task');
const upload = require('./router/upload');
const joi = require('joi');
// 导入配置文件
const config = require('./config/config');
//解析token的中间件
const { expressjwt: jwt } = require('express-jwt');

// write your code here...
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 响应数据的中间件
app.use((req, res, next) => {
    // status = 200 为成功； status = 500 为服务端失败；status = 400 为客户端失败； 默认将 status 的值设置为 500，方便处理失败的情况
    res.cc = (err, code = 400) => {
        res.send({
            // 状态
            code,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            msg: err instanceof Error ? err.message : err,
        });
    };
    res.selectErr = (err, result, msg = '查询失败！') => {
        if (err) {
            res.cc(err, 500);
            return false;
        }
        if (result.length !== 1) {
            res.cc(msg, 400);
            return false;
        }

        return true;
    };

    res.updateErr = (err, result, msg = '更新失败！') => {
        if (err) {
            res.cc(err, 500);
            return false;
        }
        if (result.affectedRows !== 1) {
            res.cc(msg, 400);
            return false;
        }

        return true;
    };
    next();
});

app.use(
    jwt({
        secret: config.jwtSecretKey,
        algorithms: ['HS256'],
    }).unless({ path: [/^\/lg\//, /^\/public\//] }),
);

app.use('/public', express.static('./uploads')); //可以通过服务器地址+pubilc+加文件夹访问静态文件
app.use('/lg', loginRouter);
app.use('/user', userRouter);
app.use('/team', teamRouter);
app.use('/cate', cateRouter);
app.use('/article', articleRouter);
app.use('/task', taskRouter);
app.use('/upload', upload); //上传图片文件等
//错误中间件
app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err);
    //身份认证失败！
    if (err.name === 'UnauthorizedError')
        return res.cc('当前网络繁忙，请稍候重试 token 失效 4004', 4004);
    // 未知错误
    res.cc(err);
});

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007');
});
