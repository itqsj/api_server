const express = require('express');
const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
    //确定图片存储的位置
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    //确定图片存储时的名字,注意，如果使用原名，可能会造成再次上传同一张图片的时候的冲突
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                '-' +
                uniqueSuffix +
                path.extname(file.originalname),
        );
    },
});
const upload = multer({ storage });

//user函数
const { userInfo } = require('../router_handler/user');

const router = express.Router();

router.get('/info', upload.single('file'), userInfo);

module.exports = router;
