const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getBrands, getOneBrand, createBrand, updateBrand, deleteBrand } = require('../controllers/brand.controller');

// Configuración de Multer para manejar imágenes
const storage = multer.diskStorage({});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const isValid = file.mimetype.startsWith('image/');
        cb(null, isValid);
    }
});

// Rutas
router.get('/', getBrands);
router.get('/:id', getOneBrand);
router.post('/', upload.single('logo'), createBrand);
router.put('/:id', upload.single('logo'), updateBrand);
router.delete('/:id', deleteBrand);

module.exports = router;
