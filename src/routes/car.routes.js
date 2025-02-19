const express = require('express');
const { getCars, createCar,getOneCar,updateCar,deleteCar } = require('../controllers/car.controller');
const router = express.Router();

router.get('/', getCars);
router.get('/:id', getOneCar);
router.post('/', createCar);
router.put('/:id',updateCar);
router.delete('/:id',deleteCar);
module.exports = router;
