const express = require("express");
const { createApiKey, getAllApiKeys, deleteApiKey } = require("../controllers/apiKey.controller");

const router = express.Router();

router.post("/", createApiKey); // Crear una API Key
router.get("/", getAllApiKeys); // Obtener todas las API Keys
router.delete("/:id", deleteApiKey); // Eliminar una API Key por ID

module.exports = router;
