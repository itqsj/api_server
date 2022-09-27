// 导入 express 模块
const express = require('express');
// 导入 cors 中间件
const cors = require('cors');
// 创建 express 的服务器实例
const app = express();
const apiRouter = require('./router/api');
const userRouter = require('./router/user');
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
    // status = 200 为成功； status = 400 为失败； 默认将 status 的值设置为 400，方便处理失败的情况
    res.cc = (err, code = 400) => {
        res.send({
            // 状态
            code,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            msg: err instanceof Error ? err.message : err,
        });
    };
    next();
});

app.use(
    jwt({
        secret: config.jwtSecretKey,
        algorithms: ['HS256'],
    }).unless({ path: [/^\/api\//, /^\/uploads\//] }),
);

app.use('/uploads', express.static('./uploads')); //可以通过服务器地址+pubilc+加文件夹访问静态文件
app.use('/api', apiRouter);
app.use('/user', userRouter);
//错误中间件
app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err);
    //身份认证失败！
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
    // 未知错误
    res.cc(err);
});

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007');
});
