const app = require('./app.js');
const mongoose = require('mongoose');
const connectUrl = require('./db/index.js');

const newConnectUrl = connectUrl.replace(
    'DB_PASSWORD',
    process.env.DB_PASSWORD,
);
mongoose
    .connect(newConnectUrl)
    .then(() => console.log('连接成功'))
    .catch((err) => {
        console.log(err, '连接失败');
    });

// eslint-disable-next-line no-undef
app.use(express.static(__dirname + '/public', { index: 'index.html' }));

// 接收全局错误
process.on('uncaughtException', (error) => {
    console.error('uncaughtException:', error);
});

process.on('unhandledRejection', (reason) => {
    console.error('unhandledRejection:', reason);
});

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007');
});
