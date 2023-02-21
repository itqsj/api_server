// const mysql = require('mysql');

// const db = mysql.createPool({
//     host: '127.0.0.1',
//     user: 'root',
//     password: 'admin123',
//     database: 'db_server',
// });

// module.exports = db;
const mongoose = require('mongoose');

mongoose
    .connect(
        'mongodb+srv://admin:qsj147258@cluster0.aspxy8l.mongodb.net/api_server?retryWrites=true&&w=majority',
    )
    .then(() => console.log('连接成功'))
    .catch((err) => console.log(err, '连接失败'));
