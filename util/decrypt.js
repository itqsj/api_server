const NodeRSA = require('node-rsa');

function decrypt(cryptData) {
    const privateKey = process.env.PRIVATE_KEY;
    // 创建JSEncrypt实例并设置私钥
    const decryptor = new NodeRSA(privateKey);
    decryptor.setOptions({ encryptionScheme: 'pkcs1' });
    // 使用私钥解密密码
    const decryptedData = decryptor.decrypt(cryptData, 'utf8');
    return JSON.parse(decryptedData);
}

module.exports = decrypt;
