const express = require('express');
const multer = require('multer');

// let storage = multer.diskStorage({
//     //确定图片存储的位置
//     destination: function (req, file, cb) {
//         console.log(123, file);
//         cb(null);
//     },
//     //确定图片存储时的名字,注意，如果使用原名，可能会造成再次上传同一张图片的时候的冲突
//     filename: function (req, file, cb) {
//         console.log(456, file);
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(
//             null,
//             file.fieldname +
//                 '-' +
//                 uniqueSuffix +
//                 path.extname(file.originalname),
//         );
//     },
// });
// const upload = multer({ storage });

// Multer 中间件
const upload = multer({
    storage: multer.memoryStorage(),
});

//user函数
const { uploadHandler } = require('../router_handler/upload');

const router = express.Router();

router.post('/file', upload.single('file'), uploadHandler);

module.exports = router;
