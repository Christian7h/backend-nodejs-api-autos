const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    price: { type: String, required: true },
    description: { type: String, required: true },
    year: { type: Number },
    type: { type: String },
    specs: {
        power: { type: String, required: true },
        acceleration: { type: String, required: true },
        topSpeed: { type: String, required: true }
    },
    stock: { type: Number, required: true },
    translations: {
        type: Map,
        of: {
            name: { type: String },
            description: { type: String },
            type: { type: String },
        },
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
