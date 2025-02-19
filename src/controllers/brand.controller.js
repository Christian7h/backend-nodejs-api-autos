const Brand = require('../models/brand.model');
const cloudinary = require('../config/cloudinary');

// Obtener todas las marcas
exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Obtener una marca por ID
exports.getOneBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        res.json(brand);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Crear una nueva marca con subida de imagen a Cloudinary

exports.createBrand = async (req, res) => {
    try {
        const { files, body } = req;
        

        // Aseguramos que 'translations' esté correctamente convertido en un Map
        if (body.translations) {
            // Asegúrate de que 'translations' es un objeto antes de convertirlo en Map
            if (typeof body.translations === 'object' && !Array.isArray(body.translations)) {
                body.translations = new Map(Object.entries(body.translations));
            } else {
                throw new Error('Invalid translations format');
            }
        }

// A esto:
if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    body.logo = result.secure_url;
}

        // Creamos la nueva marca
        const newBrand = new Brand(body);
        await newBrand.save();

        res.status(201).json({ message: 'Brand created successfully', brand: newBrand });
    } catch (error) {
        console.error(error);  // Imprime el error en la consola
        res.status(400).json({ error: error.message || 'Invalid data' });
    }
};


// Actualizar una marca con subida opcional de imagen a Cloudinary
exports.updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        // Si hay un archivo de imagen, súbelo a Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            req.body.logo = result.secure_url;  // Actualiza el logo con la nueva URL
        }

        // Actualiza la marca
        Object.assign(brand, req.body);
        await brand.save();

        res.json({ message: 'Brand updated successfully', brand });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Eliminar una marca
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        res.json({ message: 'Brand deleted successfully', brand });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
