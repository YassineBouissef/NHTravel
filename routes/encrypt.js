const Crypto = require("crypto");
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

exports.encrypt = function (text) {
    let cipher = Crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    let crypted = cipher.update(JSON.stringify(text), 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function (text) {
    let decipher = Crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
};