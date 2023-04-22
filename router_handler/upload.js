const qiniu = require('qiniu');
const crypto = require('crypto');

// 七牛配置信息
const accessKey = 'SNIk0fJtzj4eON_MqXrS9xvq0duXku7gdYaJj6Sb';
const secretKey = 'CEpu1yd0nJLG8FrvPQpXBQCkqWwZ3VHGDguIpi0a';
const bucket = 'mqweb';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
    scope: bucket,
};
const config = new qiniu.conf.Config();
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

exports.uploadHandler = (req, res) => {
    const file = req.file;
    // 生成七牛存储的文件名，可以根据实际情况修改
    const key = Date.now() + '_' + file.originalname;
    // 计算文件的 MD5 值
    const md5Hash = crypto.createHash('md5').update(file.buffer).digest('hex');
    putExtra.params = {
        'x:md5': md5Hash,
    };
    // 生成上传凭证
    const uploadToken = new qiniu.rs.PutPolicy(options).uploadToken(mac);
    // 上传文件到七牛云存储
    formUploader.put(
        uploadToken,
        key,
        file.buffer,
        putExtra,
        function (respErr, respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }

            if (respInfo.statusCode === 200) {
                res.json({
                    url: `http://rtgza51w8.hn-bkt.clouddn.com/${key}?e=${Date.now()}`,
                });
            } else {
                res.status(respInfo.statusCode).json(respBody);
            }
        },
    );
};
