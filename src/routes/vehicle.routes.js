const express = require('express');
const upload = require('../middlewares/upload');
const cache = require('../middlewares/cache'); // Importa el middleware de caché

const {
    getVehicles,
    createVehicle,
    getOneVehicle,
    updateVehicle,
    deleteVehicle,
    getVehiclesByBrand
} = require('../controllers/vehicle.controller');

const router = express.Router();

router.get('/',cache, getVehicles);
router.get('/:id',cache, getOneVehicle);
router.get('/brand/:brandId',cache, getVehiclesByBrand);

// Subida de una imagen principal y múltiples imágenes para galería
router.post('/', 
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]), 
    createVehicle
);

router.put('/:id', 
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'images', maxCount: 10 }
    ]), 
    updateVehicle
);

router.delete('/:id', deleteVehicle);

module.exports = router;
