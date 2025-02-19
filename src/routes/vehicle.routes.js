const express = require('express');
const upload = require('../middlewares/upload');
const {
    getVehicles,
    createVehicle,
    getOneVehicle,
    updateVehicle,
    deleteVehicle,
    getVehiclesByBrand
} = require('../controllers/vehicle.controller');

const router = express.Router();

router.get('/', getVehicles);
router.get('/:id', getOneVehicle);
router.get('/brand/:brandId', getVehiclesByBrand);

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
