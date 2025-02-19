const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    history: { type: String },
    trajectory: { type: String },
    foundation: { type: Number },
    translations: {
        type: Map,
        of: {
            name: { type: String },
            description: { type: String },
            history: { type: String },
            trajectory: { type: String },
            foundation: { type: String },
        },
    }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);