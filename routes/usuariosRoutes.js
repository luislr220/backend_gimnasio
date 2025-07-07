const express = require("express");
const router = express.Router();
const usuarioController = require('../controllers/usuariosController');

// Registrar usuario
router.post("/registrar", usuarioController.registrarUsuario);

// Actualizar usuario
router.put("/actualizar", usuarioController.actualizarUsuario);



module.exports