const crypto = require('crypto');
const config = require('../config.json');

const secret = config.auth_token_secret;
const algorithm = 'aes-192-cbc';

const key = crypto.scryptSync(secret, 'salt', 24);
const iv = Buffer.alloc(16, 0); // Initialization crypto vector

export function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(text) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
