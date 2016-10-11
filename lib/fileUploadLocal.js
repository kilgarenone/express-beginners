const multer = require('multer');
const fs = require('fs');

const dataDir = `${process.env.PWD}/uploads`;

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

function fileUploadLocal() {
    const storage = multer.diskStorage({
        destination(req, file, callback) {
            callback(null, dataDir);
        },
        filename(req, file, callback) {
            callback(null, `${file.fieldname}-${Date.now()}`);
        },
    });

    const upload = multer({ storage }).array('photo', 5);

    const uploadToLocal = function (req, res) {
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
}

module.exports = fileUploadLocal;
