exports.uploadHandler = (req, res) => {
    // //接收上传图片请求的接口
    //图片已经被放入到服务器里,且req也已经被upload中间件给处理好了（加上了file等信息）
    //线上的也就是服务器中的图片的绝对地址
    let domin = req.protocol + '://' + req.get('host');
    let url = domin + '/public/' + req.file.filename;

    res.send({
        code: 200,
        data: url,
    });
};
