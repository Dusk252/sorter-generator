const AWS = require('aws-sdk');
const config = require('../config.json').amazon_s3;
const bucketname = config.bucket_name;

const s3 = new AWS.S3({
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key
});

const uploadFile = (file, path, mimeType) => {
    return s3
        .upload({
            Bucket: bucketname,
            Key: path,
            Body: file,
            ContentType: mimeType,
            ACL: 'public-read'
        })
        .promise();
};

export default uploadFile;
