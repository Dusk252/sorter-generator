const jwt = require('jsonwebtoken');
const config = require('./../config.json');
const { tokenType } = require('./../_helpers/enum');
//const { encrypt, decrypt } = require('./../_helpers/encryptionUtil');

const access_token_expiration = 1800;
const refresh_token_expiration = '30d';

export const generateAccessToken = (sub) => {
    return generateToken(sub, tokenType.ACCESS_TOKEN);
};

export const generateRefreshToken = (sub) => {
    return generateToken(sub, tokenType.REFRESH_TOKEN);
};

const generateToken = (sub, type) => {
    const secret = config.authentication_token_secret;
    //if encrypting, do it here
    return jwt.sign({ type }, secret, {
        expiresIn: type == tokenType.ACCESS_TOKEN ? access_token_expiration : refresh_token_expiration,
        subject: JSON.stringify(sub)
    });
};

//only needed if decrypting, do it inside verify
// export const getTokenData = (token) => {
//     return jwt.verify(token, config.authentication_token_secret);
// };
