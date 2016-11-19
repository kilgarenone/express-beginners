/*
    Using the Multer library for file uploading capability
    https://github.com/expressjs/multer
*/

const multer = require('multer');
const fs = require('fs');
const appRoot = require('app-root-path');

const dataDir = `${appRoot}/uploads`;

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const fileUploadLocal = (function fileUploadLocal() {
    const storage = multer.diskStorage({
        destination(req, file, callback) {
            callback(null, dataDir);
        },
        filename(req, file, callback) {
            console.log(file);
            callback(null, `${file.fieldname}-${Date.now()}`);
        },
    });


    const uploadToLocal = function uploadToLocal(fieldNameArr, req, res) {
        const upload = multer({ storage }).fields(fieldNameArr);

        upload(req, res, (err) => {
            console.log('Form Text fields: ', req.body);
            console.log('Form File Uploads: ', req.files);
            if (err) return res.redirect(303, '/error');
            return res.redirect(303, '/thank-you');
        });
    };

    return {
        upload: uploadToLocal,
    };
}());

module.exports = fileUploadLocal;
