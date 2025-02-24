const ApiKey = require("../models/apiKey.model");

const checkApiKey = async (req, res, next) => {
    try {
        const apiKey = req.header("x-api-key");

        if (!apiKey) {
            return res.status(401).json({ error: "API Key requerida" });
        }

        const validKey = await ApiKey.findOne({ key: apiKey });

        if (!validKey) {
            return res.status(403).json({ error: "API Key inválida" });
        }

        if (!validKey.active) {
            return res.status(403).json({ error: "API Key desactivada y/o expirada" });
        }

        if (validKey.expiresAt && validKey.expiresAt < new Date()) {
            return res.status(403).json({ error: "API Key expirada" });
        }

        next(); // Permite el acceso si todo está correcto
    } catch (error) {
        console.error("Error al verificar la API Key:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
module.exports = checkApiKey;
