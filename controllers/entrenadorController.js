const Entrenador = require("../models/entrenador");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

exports.crearEntrenador = async (req, res) => {
  const {
    id_gimnasio,
    nombre,
    correo,
    contrasena,
    foto,
    edad,
    costo_sesion,
    costo_mensual,
    telefono,
  } = req.body;

  // Validar campos obligatorios
  if (
    !id_gimnasio ||
    !nombre ||
    !correo ||
    !contrasena ||
    !foto ||
    !edad ||
    !costo_sesion ||
    !costo_mensual ||
    !telefono
  ) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos incompletos",
      detalles: "Todos los campos son obligatorios",
    });
  }

  try {
    // Verificar si el correo ya existe
    const entrenadorExistente = await Entrenador.buscarPorCorreo(correo);
    if (entrenadorExistente) {
      return res.status(400).json({
        exito: false,
        mensaje: "Correo ya registrado",
        detalles: "Por favor use otro correo electrónico",
      });
    }

    // Encriptar contraseña
    const hashContrasena = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const entrenador = await Entrenador.crearEntrenador({
      id_gimnasio,
      nombre,
      correo,
      contrasena: hashContrasena,
      foto,
      edad,
      costo_sesion,
      costo_mensual,
      telefono,
    });

    // Eliminar la contraseña de la respuesta
    const { contrasena: _, ...entrenadorSinContrasena } = entrenador;

    res.status(201).json({
      exito: true,
      mensaje: "Entrenador creado correctamente",
      datos: entrenadorSinContrasena,
    });
  } catch (error) {
    console.error("Error al crear el entrenador:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        exito: false,
        mensaje: "El gimnasio no existe",
        detalles: "Por favor ingrese un gimnasio válido",
      });
    }

    if (error.code === "23505") {
      return res.status(400).json({
        exito: false,
        mensaje: "El correo ya está registrado",
        detalles: "Por favor use otro correo electrónico",
      });
    }

    res.status(500).json({
      exito: false,
      mensaje: "Error al crear el entrenador",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

//Obtener entrenador por gym
exports.obtenerPorGym = async (req, res) => {
  const { id_gimnasio } = req.body;

  if (!id_gimnasio) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos incompletos",
      detalles: "El id del gimnasio es obligatorio",
    });
  }

  try {
    const entrenadores = await Entrenador.obtenerPorGym(id_gimnasio);
    res.json({
      exito: true,
      mensaje: "Entrenadores encontrados",
      datos: entrenadores,
    });
  } catch (error) {
    console.error("Error al obtener los entrenadores por gimnasio:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener los entrenadores",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

exports.obtenerPorId = async (req, res) => {
  const { id_entrenador } = req.params;

  if (!id_entrenador) {
    return res.status(400).json({
      exito: false,
      mensaje: "Datos incompletos",
      detalles: "El id del entrenador es obligatorio",
    });
  }

  try {
    const entrenador = await Entrenador.obtenerPorId(id_entrenador);
    if (!entrenador) {
      return res.status(404).json({
        exito: false,
        mensaje: "Entrenador no encontrado",
      });
    }
    res.json({
      exito: true,
      mensaje: "Entrenador encontrado",
      datos: entrenador,
    });
  } catch (error) {
    console.error("Error al obtener el entrenador:", error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al obtener el entrenador",
      detalles: "Ocurrió un error interno del servidor",
    });
  }
};

exports.darseDeBajaDelGym = async (req, res) => {
  const { id_entrenador } = req.body;

  if (!id_entrenador) {
    return res.status(400).json({
      exito: false,
      mensaje: "ID de entrenador requerido",
    });
  }

  try {
    const entrenador = await Entrenador.darseDeBajaDelGym(id_entrenador);
    if (!entrenador) {
      return res.status(404).json({
        exito: false,
        mensaje: "Entrenador no encontrado o ya está dado de baja",
      });
    }
    res.json({
      exito: true,
      mensaje: "Te has dado de baja del gimnasio correctamente",
      datos: entrenador,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      exito: false,
      mensaje: "Error al darse de baja del gimnasio",
    });
  }
};
