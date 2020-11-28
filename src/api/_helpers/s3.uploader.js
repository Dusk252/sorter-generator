const AWS = require('aws-sdk');
const bucketname = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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
