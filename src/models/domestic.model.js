const mongoose = require('mongoose');

const domesticSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // Ej: Refrigerador, Lavadora, etc.
    features: { type: [String], default: [] }, // Lista de características
    stock: { type: Number, required: true, default: 0 },
    image: { type: String }, // URL de la imagen del producto
}, { timestamps: true });

module.exports = mongoose.model('Domestic', domesticSchema);
