module.exports = fileUploadHandler;

const fileUpload = require('express-fileupload');

const CustomError = () => ({
    status: 'failed',
    error: 'Attempted to upload an invalid file type.'
});

function fileUploadHandler({ mimeTypeRegex, ...options }) {
    //recursively walks through object keys
    const processObject = (jsonObj, fileObj) => {
        const jsonKeys = Object.keys(jsonObj);
        const fileKeys = Object.keys(fileObj);

        //for each file in one level
        for (let key of fileKeys) {
            if (jsonKeys.includes(key)) {
                //if the key always exists in that level of the json
                if (Array.isArray(jsonObj[key]) && Array.isArray(fileObj[key])) {
                    //both are arrays so we have a recursive call for each of the objects inside
                    for (let index in fileObj[key]) {
                        processObject(jsonObj[key][index], fileObj[key][index]);
                    }
                } else if (jsonObj[key] instanceof Object && fileObj[key] instanceof Object) {
                    //check the next level
                    processObject(jsonObj[key], fileObj[key]);
                }
            } else if (!Array.isArray(fileObj[key])) {
                //if file is of an accepted filetype
                if (fileObj[key] && fileObj[key].mimetype && fileObj[key].mimetype.match(mimeTypeRegex))
                    jsonObj[key] = fileObj[key];
                else throw new CustomError();
            }
        }
    };

    return [
        fileUpload(options),
        (req, res, next) => {
            try {
                //walks through the req.body json and the req.files json
                //return by the fileUpload middleware and tries to join these together
                //req.body should have a json structure that has either urls or Objects with
                //a data buffer corresponding to uploaded files as the picture fields
                processObject(req.body, req.files);
                next();
            } catch (err) {
                res.status(400).json(err);
            }
        }
    ];
}
