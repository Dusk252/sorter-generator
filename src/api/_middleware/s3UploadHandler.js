module.exports = s3UploadHandler;
const uploadFile = require('../_helpers/s3.uploader').default;
const { nanoid } = require('nanoid');
const axios = require('axios');
const sharp = require('sharp');
const fileType = require('file-type');
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)$/;

const CustomError = () => ({
    status: 'failed',
    error: 'Failed to upload a picture.'
});

const getExtensionFromMimeType = (mimeType, mimeTypeRegex) => {
    const extension = mimeType.match(mimeTypeRegex);
    if (!extension) return null;
    return extension[1];
};

const uploadFromUrl = async (url, path, mimeTypeRegex) => {
    const transformFunction = sharp().resize(500, 500, { fit: 'outside', withoutEnlargement: true });
    //get file from url as stream
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    const fileTypeStream = await fileType.stream(response.data);
    const type = fileTypeStream.fileType;
    //get and check mimetype from the file gotten
    if (type && mimeTypeRegex.test(type.mime) && type.ext) {
        //pipe stream through transform function and into amazons3
        const data = await uploadFile(fileTypeStream.pipe(transformFunction), `${path}.${type.ext}`, type.mime);
        return data.key;
    } else throw new CustomError();
};

const uploadFromFile = async (fileObj, path, mimeTypeRegex) => {
    const extension = getExtensionFromMimeType(fileObj.mimetype, mimeTypeRegex);
    if (extension) {
        //transform pic (buffer) with sharp and pipe resulting stream into amazons3
        const data = await uploadFile(
            sharp(fileObj.data).resize(500, 500, { fit: 'outside', withoutEnlargement: true }),
            `${path}.${extension}`,
            fileObj.mimetype
        );
        return data.key;
    } else throw new CustomError();
};

function s3UploadHandler(objectMapArray, mimeTypeRegex) {
    const processObj = async (jsonObj, objectPath, uploadPath, keyIndex) => {
        //we've reached the end of the path, there's nothing else to process
        if (keyIndex >= objectPath.length) return;
        const key = objectPath[keyIndex];
        const current = jsonObj[key];
        //we're at the last key in the path, this is where our picture should be
        if (current && keyIndex === objectPath.length - 1) {
            const path = `${uploadPath}${nanoid(17)}`;
            if (typeof current === 'string') {
                //if it's an url
                if (urlRegex.test(current)) jsonObj[key] = await uploadFromUrl(current, path, mimeTypeRegex);
            } else if (current instanceof Object) {
                //if it's an object
                if (current.data && current.mimetype && mimeTypeRegex.test(current.mimetype))
                    jsonObj[key] = await uploadFromFile(current, path, mimeTypeRegex);
            }
            //empty
            else jsonObj[key] = '';
        } else if (current) {
            //we're not at the end of the path yet, but a value exists
            //let's proceed
            if (Array.isArray(current)) {
                //if it's an array process each item individually (and concurrently)
                let promiseArray = [];
                for (let obj of current) {
                    promiseArray.push(processObj(obj, objectPath, uploadPath, keyIndex + 1));
                }
                await Promise.all(promiseArray);
            } else await processObj(current, objectPath, uploadPath, keyIndex + 1);
        }
        return;
    };

    return [
        async (req, res, next) => {
            try {
                let promiseArray = [];
                //receives a map of which properties should contain pictrues as an array of keys
                //for each of these, walk through the object and process the relevant properties
                for (const objectMap of objectMapArray) {
                    promiseArray.push(processObj(req.body, objectMap.objectPath, objectMap.uploadPath, 0));
                }
                await Promise.all(promiseArray);
                next();
            } catch (err) {
                console.log(err);
                res.status(500).json(new CustomError());
            }
        }
    ];
}
