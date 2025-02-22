const Vehicle = require('../models/vehicle.model');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

// Función para cargar imágenes en Cloudinary
const uploadImage = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
    } catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error);
        throw new Error('Image upload failed');
    }
};

exports.getVehicles = async (req, res) => {
    try {
        const { brandId } = req.query;
        let filter = {};

        if (brandId) {
            if (!mongoose.Types.ObjectId.isValid(brandId)) {
                return res.status(400).json({ error: 'Invalid brandId' });
            }
            filter.brandId = brandId;
        }

        const vehicles = await Vehicle.find(filter).populate('brandId', 'name logo');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

exports.getOneVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('brandId', 'name logo');
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

exports.getVehiclesByBrand = async (req, res) => {
    try {
        const { brandId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(brandId)) {
            return res.status(400).json({ error: 'Invalid brandId format' });
        }

        const vehicles = await Vehicle.find({ brandId }).populate('brandId', 'name logo');
        
        if (!vehicles.length) {
            return res.status(404).json({ error: 'No vehicles found for this brand' });
        }

        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

exports.createVehicle = async (req, res) => {
    try {
        const { files, body } = req;

        if (body.translations) {
            body.translations = new Map(Object.entries(body.translations));
        }

        // Subir imagen principal
        if (files.image) {
            body.image = await uploadImage(files.image[0]);
        }

        // Subir galería de imágenes
        if (files.images) {
            body.images = await Promise.all(files.images.map(file => uploadImage(file)));
        }

        const newVehicle = new Vehicle(body);
        await newVehicle.save();
        res.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: error.message || 'Invalid data' });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const { files, body } = req;

        // Subir nueva imagen principal si se proporciona
        if (files.image) {
            body.image = await uploadImage(files.image[0]);
        }

        // Subir nuevas imágenes de galería si se proporcionan
        if (files.images) {
            body.images = await Promise.all(files.images.map(file => uploadImage(file)));
        }

        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle updated successfully', vehicle });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully', vehicle });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};
