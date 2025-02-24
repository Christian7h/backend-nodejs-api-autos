const Domestic = require('../models/domestic.model');
const cloudinary = require('../config/cloudinary');

// Obtener todos los electrodomésticos con paginación
exports.getDomestics = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const domestics = await Domestic.find().skip(skip).limit(limit);
        const total = await Domestic.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.json({ domestics, total, pages: totalPages });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener electrodomésticos' });
    }
};

// Obtener un solo electrodoméstico por ID
exports.getOneDomestic = async (req, res) => {
    try {
        const domestic = await Domestic.findById(req.params.id);
        if (!domestic) {
            return res.status(404).json({ error: 'Electrodoméstico no encontrado' });
        }
        res.json(domestic);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Crear un nuevo electrodoméstico
exports.createDomestic = async (req, res) => {
    try {
        const { files, body } = req;

        // A esto:
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            body.image = result.secure_url;
        }
        const newDomestic = new Domestic(req.body);
        await newDomestic.save();
        res.status(201).json({ message: 'Electrodoméstico creado', domestic: newDomestic });
    } catch (error) {
        res.status(400).json({ error: 'Datos inválidos' });
    }
};

// Actualizar un electrodoméstico
exports.updateDomestic = async (req, res) => {
    try {
        const updatedDomestic = await Domestic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedDomestic) {
            return res.status(404).json({ error: 'Electrodoméstico no encontrado' });
        }
        res.json({ message: 'Electrodoméstico actualizado', domestic: updatedDomestic });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
};

// Eliminar un electrodoméstico
exports.deleteDomestic = async (req, res) => {
    try {
        const deletedDomestic = await Domestic.findByIdAndDelete(req.params.id);
        if (!deletedDomestic) {
            return res.status(404).json({ error: 'Electrodoméstico no encontrado' });
        }
        res.json({ message: 'Electrodoméstico eliminado', domestic: deletedDomestic });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
};
