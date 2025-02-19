const Car = require('../models/car.model');

exports.getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getOneCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            res.status(404).json({ error: 'Coche no encontrado' });
        } else {
            res.json(car);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createCar = async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.status(201).json({ message: 'Coche creado con éxito', car: newCar });
    } catch (error) {
        res.status(400).json({ error: 'Datos no válidos' });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!car) {
            return res.status(404).json({ error: 'Coche no encontrado' });
        }
        res.json({ message: 'Coche creado con éxito', car });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({ error: 'Coche no encontrado' });
        }
        res.json({ message: 'Coche creado con éxito', car });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
