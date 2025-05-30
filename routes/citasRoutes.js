const express = require("express");
const router = express.Router();
const citasController = require("../controllers/citaController");

// Rutas para usuarios
router.post("/crear", citasController.crearCita);
router.post("/mis-citas", citasController.obtenerCitas);
router.put("/cancelar", citasController.cancelarCita);

// Rutas para entrenadores
router.put("/actualizar-estado", citasController.actualizarEstadoCita);

module.exports = router;