const baseURL = "http://127.0.0.1:3000"
global.baseURL = baseURL

const fileSystem = require("fs");

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = "JhdjYhayqds35CxuHYGUssu91i2Pla12";

global.encrypt = function (text) {
	const iv = crypto.randomBytes(16);

    const message = text;

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    const base64data = Buffer.from(iv, 'binary').toString('base64');
    return {
        iv: base64data,
        encryptedData: encryptedData
    };
};

global.decrypt = function (text) {
    const origionalData = Buffer.from(text.iv, 'base64') 

    const decipher = crypto.createDecipheriv(algorithm, key, origionalData);
    let decryptedData = decipher.update(text.encryptedData, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
};

global.base64Encode = function(file) {
    var bitmap = fileSystem.readFileSync(file);
    return new Buffer.from(bitmap).toString('base64');
}

global.existsInContact = function (user, _id) {
    for (let a = 0; a < user.contacts.length; a++) {
        if (user.contacts[a]._id.toString() == _id.toString()) {
            return {
                password: ""
            }
        }
    }
    return null
}