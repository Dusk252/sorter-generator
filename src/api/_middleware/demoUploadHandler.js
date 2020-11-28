//very rudimentary local upload demo - the intended thing to use is the amazons3 one
module.exports = demoUploadHandler;
const { nanoid } = require('nanoid');
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const stream = require('stream');
const fileType = require('file-type');
const path = require('path');
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=()]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=()]*)$/;

const uploadRoot = process.env.LOCAL_UPLOAD_PATH ? path.join(__dirname, process.env.LOCAL_UPLOAD_PATH) : '';
const pipeline = util.promisify(stream.pipeline);

const CustomError = () => ({
    message: 'Failed to upload a picture.'
});

const getExtensionFromMimeType = (mimeType, mimeTypeRegex) => {
    const extension = mimeType.match(mimeTypeRegex);
    if (!extension) return null;
    return extension[1];
};

const ensureDirectoryExistence = (filePath) => {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

const uploadFromUrl = async (url, uploadPath, mimeTypeRegex) => {
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
        const path = `${uploadPath}.${type.ext}`;
        ensureDirectoryExistence(`${uploadRoot}${path}`);
        const writeStream = fs.createWriteStream(`${uploadRoot}${path}`);
        await pipeline(fileTypeStream, writeStream);
        return path;
    } else throw new CustomError();
};

const uploadFromFile = async (fileObj, uploadPath, mimeTypeRegex) => {
    const extension = getExtensionFromMimeType(fileObj.mimetype, mimeTypeRegex);
    if (extension) {
        const path = `${uploadPath}.${extension}`;
        ensureDirectoryExistence(`${uploadRoot}${path}`);
        fileObj.mv(`${uploadRoot}${path}`);
        return path;
    } else throw new CustomError();
};

function demoUploadHandler(objectMapArray, mimeTypeRegex) {
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
