const express = require("express");
const multer = require("multer");
const checkApiKey = require("../middlewares/apiKey"); // Importa el middleware

const cache = require("../middlewares/cache"); // Middleware de caché si lo usas
const {
  getDomestics,
  getOneDomestic,
  createDomestic,
  updateDomestic,
  deleteDomestic,
} = require("../controllers/domestic.controller");

const router = express.Router();
// Configuración de Multer para manejar imágenes
const storage = multer.diskStorage({});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isValid = file.mimetype.startsWith("image/");
    cb(null, isValid);
  },
});

router.get("/",checkApiKey, cache, getDomestics);
router.get("/:id",checkApiKey, cache, getOneDomestic);
router.post("/",checkApiKey, upload.single("image"), createDomestic);
router.put("/:id",checkApiKey, updateDomestic);
router.delete("/:id",checkApiKey, deleteDomestic);

module.exports = router;
