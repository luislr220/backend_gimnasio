const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const { sanitizeInput, sanitizeEmail } = require("../utils/sanitization");
const SALT_ROUNDS = 10;

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
  const nombre = sanitizeInput(req.body.nombre);
  const correo = sanitizeEmail(req.body.correo);
  const contrasena = req.body.contrasena;
  const rol = sanitizeInput(req.body.rol);

  if (!nombre || !correo || !contrasena || !rol) {
    return res.status(400).json({
      exito: false,
      mensaje: "Por favor llene todos los campos",
      detalles: "Todos los campos son obligatorios",
    });
  }

  try {
    const hashContrasena = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const usuario = await Usuario.crearUsuario({
      nombre,
      correo,
      contrasena: hashContrasena,
      rol,
    });

    const { contrasena: _, ...usuarioSinContrasena } = usuario;

    res.status(201).json({
      exito: true,
      mensaje: "Usuario registrado exitosamente",
      datos: usuarioSinContrasena,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        exito: false,
        mensaje: "El correo ya está registrado",
        detalles: "Por favor use otro correo electrónico",
      });
    }

    res.status(500).json({
      exito: false,
      mensaje: "Error al registrar usuario",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  const id_usuario = req.body.id_usuario;
  const nombre = sanitizeInput(req.body.nombre);
  const correo = sanitizeEmail(req.body.correo);

  if (!id_usuario || !nombre || !correo) {
    return res.status(400).json({
      exito: false,
      mensaje: "Por favor llene todos los campos",
      detalles: "Todos los campos son obligatorios",
    });
  }

  try {
    const usuarioActualizado = await Usuario.actualizarUsuario({
      id_usuario,
      nombre,
      correo,
    });

    if (!usuarioActualizado) {
      return res.status(404).json({
        exito: false,
        mensaje: "Usuario no encontrado",
        detalles: "No existe un usuario con ese ID",
      });
    }

    const { contrasena, ...usuarioSinContrasena } = usuarioActualizado;

    res.json({
      exito: true,
      mensaje: "Usuario actualizado exitosamente",
      datos: usuarioSinContrasena,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        exito: false,
        mensaje: "El correo ya está registrado",
        detalles: "Por favor use otro correo electrónico",
      });
    }

    res.status(500).json({
      exito: false,
      mensaje: "Error al actualizar usuario",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  const id_usuario = req.body.id_usuario;

  if (!id_usuario) {
    return res.status(400).json({
      exito: false,
      mensaje: "ID de usuario requerido",
    });
  }

  try {
    const eliminado = await Usuario.eliminarUsuario(id_usuario);
    if (!eliminado) {
      return res.status(404).json({
        exito: false,
        mensaje: "Usuario no encontrado",
      });
    }
    res.json({
      exito: true,
      mensaje: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al eliminar usuario",
      detalles: "Ocurrió un error interno del servidor",
    });