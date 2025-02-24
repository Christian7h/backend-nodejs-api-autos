const ApiKey = require("../models/apiKey"); // Asegúrate de tener el modelo correcto

const checkApiKey = async (req, res, next) => {
    try {
        const apiKey = req.header("x-api-key");

        if (!apiKey) {
            return res.status(401).json({ error: "API Key requerida" });
        }

        // Buscar API Key en la base de datos
        const validKey = await ApiKey.findOne({ key: apiKey });

        if (!validKey) {
            return res.status(403).json({ error: "API Key inválida" });
        }

        // Verificar si la clave ha expirado
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
