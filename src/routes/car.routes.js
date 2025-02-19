const express = require('express');
const apicache = require('apicache');
const { getCars, createCar, getOneCar, updateCar, deleteCar } = require('../controllers/car.controller');

const router = express.Router();
const cache = apicache.middleware;

// Configura el cache para las rutas que retornan datos
router.get('/', cache('5 minutes'), getCars);  // Cache durante 5 minutos
router.get('/:id', cache('5 minutes'), getOneCar);  // Cache durante 5 minutos

// Ruta para crear un nuevo auto (no cacheada)
router.post('/', async (req, res, next) => {
    try {
        // Llamada a tu lógica de creación de auto
        await createCar(req, res);

        // Eliminar el cache de la lista de autos, ya que se ha creado un nuevo auto
        apicache.clear('/api/cars');

        // Solo envía la respuesta una vez
        res.status(201).json({ message: 'Auto creado exitosamente' });
    } catch (err) {
        // Si ocurre un error, pasa al siguiente middleware de manejo de errores
        next(err);
    }
});

// Ruta para actualizar un auto (no cacheada)
router.put('/:id', async (req, res, next) => {
    try {
        // Llamada a la lógica de actualización de auto
        await updateCar(req, res);

        // Eliminar el cache de la lista de autos y el cache del auto específico
        apicache.clear('/api/cars');
        apicache.clear(`/api/cars/${req.params.id}`);

        // Solo envía la respuesta una vez después de las operaciones
        res.status(200).json({ message: 'Auto actualizado exitosamente' });
    } catch (err) {
        // Si ocurre un error, pasa al siguiente middleware de manejo de errores
        next(err);
    }
});


// Ruta para eliminar un auto (no cacheada)
router.delete('/:id', async (req, res, next) => {
    try {
        // Llamada a la lógica de eliminación de auto
        await deleteCar(req, res);

        // Eliminar el cache de la lista de autos y el cache del auto específico que fue eliminado
        apicache.clear('/api/cars');
        apicache.clear(`/api/cars/${req.params.id}`);

        // Solo envía la respuesta una vez después de las operaciones
        res.status(200).json({ message: 'Auto eliminado exitosamente' });
    } catch (err) {
        // Si ocurre un error, pasa al siguiente middleware de manejo de errores
        next(err);
    }
});

module.exports = router;
