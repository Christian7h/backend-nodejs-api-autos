const ApiKey = require("../models/apiKey");
const crypto = require("crypto");

exports.createApiKey = async (req, res) => {
  try {
    const { owner, expiresAt } = req.body;

    // Generar una API Key segura
    const key = crypto.randomBytes(32).toString("hex");

    const newApiKey = new ApiKey({ key, owner, expiresAt });
    await newApiKey.save();

    res.json({ message: "API Key generada con éxito", key });
  } catch (error) {
    res.status(500).json({ error: "Error al generar la API Key" });
  }
};

exports.getAllApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find();
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las API Keys" });
  }
};

exports.deleteApiKey = async (req, res) => {
  try {
    await ApiKey.findByIdAndDelete(req.params.id);
    res.json({ message: "API Key eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la API Key" });
  }
};
