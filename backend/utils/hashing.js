const crypto = require('crypto');
const { hash, compare} = require("bcryptjs")

exports.doHash = (value,saltValue) => {
    const result=hash(value,saltValue);
    return result;
};

exports.doHashValidation = (value,hashedValue) => {
    const result=compare(value,hashedValue);
    return result;
};

exports.hmacProcess = (value,secretKey) => {
    const result=crypto.createHmac('sha256',secretKey).update(value).digest('hex');
    return result;
};