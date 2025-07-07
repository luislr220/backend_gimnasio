const express = require("express");
const router = express.Router();
const usuarioController = require('../controllers/usuariosController');

// Registrar usuario
router.post("/registrar", usuarioController.registrarUsuario);

// Actualizar usuario
router.put("/actualizar", usuarioController.actualizarUsuario);

// Obtener todos los usuarios
router.get("/listar", usuarioController.obtenerUsuarios);

// Obtener usuario por ID
router.get("/:id_usuario", usuarioController.obtenerUsuarioPorId);

// Eliminar usuario
router.delete("/eliminar/:id_usuario", usuarioController.eliminarUsuario);

module.exports = router;