const Vehicle = require('../models/vehicle.model');
const cloudinary = require('../config/cloudinary');

exports.getVehicles = async (req, res) => {
    try {
        const { brandId } = req.query; // Capturar brandId desde query params
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
        res.status(500).json({ error: 'Server error' });
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
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getVehiclesByBrand = async (req, res) => {
    try {
        const { brandId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(brandId)) {
            return res.status(400).json({ error: 'Invalid brandId' });
        }

        const vehicles = await Vehicle.find({ brandId }).populate('brandId', 'name logo');
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createVehicle = async (req, res) => {
    try {
        const { files, body } = req;

        // Convertir el campo translations a un Map
        if (body.translations) {
            body.translations = new Map(Object.entries(body.translations));
        }

        // Subir imagen principal
        if (files.image) {
            const result = await cloudinary.uploader.upload(files.image[0].path);
            body.image = result.secure_url;
        }

        // Subir galería de imágenes
        if (files.images) {
            body.images = [];
            for (let file of files.images) {
                const result = await cloudinary.uploader.upload(file.path);
                body.images.push(result.secure_url);
            }
        }

        const newVehicle = new Vehicle(body);
        await newVehicle.save();
        res.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ error: 'Invalid data' });
    }
};


exports.updateVehicle = async (req, res) => {
    try {
        const { files, body } = req;

        // Subir nueva imagen principal si se proporciona
        if (files.image) {
            const result = await cloudinary.uploader.upload(files.image[0].path);
            body.image = result.secure_url;
        }

        // Subir nuevas imágenes de galería si se proporcionan
        if (files.images) {
            body.images = [];
            for (let file of files.images) {
                const result = await cloudinary.uploader.upload(file.path);
                body.images.push(result.secure_url);
            }
        }

        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle updated successfully', vehicle });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
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
        res.status(500).json({ error: 'Server error' });
    }
};
