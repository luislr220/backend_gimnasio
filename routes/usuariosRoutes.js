const express = require("express");
const router = express.Router();
const usuarioController = require('../controllers/usuariosController');

// Registrar usuario
router.post("/registrar", usuarioController.registrarUsuario);

// Actualizar usuario
router.put("/actualizar", usuarioController.actualizarUsuario);

// Obtener usuario por ID (si lo necesitas en el futuro)
router.get("/:id_usuario", usuarioController.obtenerUsuarioPorId);

module.exports