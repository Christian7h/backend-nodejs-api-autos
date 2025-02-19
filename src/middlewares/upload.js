const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'vehicles',
        allowed_formats: ['jpg', 'jpeg', 'png']
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        if (isValid) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de imagen no válido'), false);
        }
    }
});

module.exports = upload;
