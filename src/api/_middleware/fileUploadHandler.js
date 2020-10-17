module.exports = fileUploadHandler;

const fileUpload = require('express-fileupload');

const CustomError = () => ({
    status: 'failed',
    error: 'Attempted to upload an invalid file type.'
});

function fileUploadHandler({ mimeTypeRegex, uploadPath, ...options }) {
    const processObject = (jsonObj, fileObj) => {
        const jsonKeys = Object.keys(jsonObj);
        const fileKeys = Object.keys(fileObj);

        for (let key of fileKeys) {
            if (jsonKeys.includes(key)) {
                if (
                    Array.isArray(jsonObj[key]) &&
                    Array.isArray(fileObj[key]) &&
                    jsonObj[key].length === fileObj[key].length
                ) {
                    for (let index in fileObj[key]) {
                        processObject(jsonObj[key][index], fileObj[key][index]);
                    }
                }
            } else if (!Array.isArray(jsonObj[key]) && !Array.isArray(fileObj[key])) {
                path = processFile(fileObj[key]);
                if (!path) throw new CustomError();
                jsonObj[key] = path;
            }
        }
    };

    const processFile = (file) => {
        const extension = file.mimetype.match(mimeTypeRegex);
        if (!extension) return null;
        const path = `${uploadPath}${Date.now()}.${extension[1]}`;
        //to do: try catching possible error on the promise
        file.mv(`${process.env.STATIC_PATH}${path}`);
        return path;
    };

    return [
        fileUpload(options),
        (req, res, next) => {
            try {
                processObject(req.body, req.files);
                next();
            } catch (err) {
                res.status(400).json(err);
            }
        }
    ];
}
