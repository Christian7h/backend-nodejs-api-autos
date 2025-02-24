const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // API Key única
  owner: { type: String, required: true }, // Dueño o propósito de la clave
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
  expiresAt: { type: Date }, // Fecha de expiración opcional
  active: { type: Boolean, default: true }, // Para desactivar claves si es necesario
});

// Expira automáticamente si se establece `expiresAt`
apiKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("ApiKey", apiKeySchema);
