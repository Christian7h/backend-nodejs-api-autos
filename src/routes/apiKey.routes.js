const express = require("express");
const { createApiKey, getAllApiKeys, deleteApiKey } = require("../controllers/apiKey.controller");

const router = express.Router();

router.post("/", createApiKey); 
router.get("/", getAllApiKeys); 
router.delete("/:id", deleteApiKey);

module.exports = router;
