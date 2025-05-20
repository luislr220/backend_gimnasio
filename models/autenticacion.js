const pool = require("../db");

// Buscar usuario por correo (primero en usuarios, luego en entrenadores)
exports.buscarUsuarioPorCorreo = async (correo) => {
  const consultaUsuario = `
    SELECT *, 'cliente' as tipo FROM usuarios 
    WHERE correo = $1
  `;
  const resultadoUsuario = await pool.query(consultaUsuario, [correo]);
  if (resultadoUsuario.rows[0]) return resultadoUsuario.rows[0];

  const consultaEntrenador = `
    SELECT *, 'entrenador' as tipo FROM entrenadores 
    WHERE correo = $1
  `;
  const resultadoEntrenador = await pool.query(consultaEntrenador, [correo]);
  return resultadoEntrenador.rows[0];
};

// Buscar entrenador por correo (solo en entrenadores)
exports.buscarEntrenadorPorCorreo = async (correo) => {
  const consulta = `
    SELECT *, 'entrenador' as tipo FROM entrenadores 
    WHERE correo = $1
  `;
  const resultado = await pool.query(consulta, [correo]);
  return resultado.rows[0];
};

// Guardar token 2FA
exports.guardarToken2FA = async (usuario, token, expiracion) => {
  const tabla = usuario.tipo === 'entrenador' ? 'entrenadores' : 'usuarios';
  const idColumn = usuario.tipo === 'entrenador' ? 'id_entrenador' : 'id_usuario';
  const id = usuario.tipo === 'entrenador' ? usuario.id_entrenador : usuario.id_usuario;

  const consulta = `
    UPDATE ${tabla}
    SET token_2fa = $1,
        token_2fa_expiracion = $2
    WHERE ${idColumn} = $3
    RETURNING *
  `;
  const resultado = await pool.query(consulta, [token, expiracion, id]);
  return resultado.rows[0];
};

// Verificar token 2FA
exports.verificarToken2FA = async (id, token, tipo) => {
  const tabla = tipo === 'entrenador' ? 'entrenadores' : 'usuarios';
  const idColumn = tipo === 'entrenador' ? 'id_entrenador' : 'id_usuario';

  const consulta = `
    SELECT * FROM ${tabla} 
    WHERE ${idColumn} = $1 
    AND token_2fa = $2 
    AND token_2fa_expiracion > NOW()
  `;
  const resultado = await pool.query(consulta, [id, token]);
  return resultado.rows[0];
};

// Limpiar token 2FA
exports.limpiarToken2FA = async (id, tipo) => {
  const tabla = tipo === 'entrenador' ? 'entrenadores' : 'usuarios';
  const idColumn = tipo === 'entrenador' ? 'id_entrenador' : 'id_usuario';

  const consulta = `
    UPDATE ${tabla} 
    SET token_2fa = NULL, 
        token_2fa_expiracion = NULL
    WHERE ${idColumn} = $1
  `;
  await pool.query(consulta, [id]);
};

// Guardar token de recuperación de contraseña
exports.guardarTokenRecuperacion = async (correo, token, expiracion, tipo) => {
  const tabla = tipo === "entrenador" ? "entrenadores" : "usuarios";
  const consulta = `
    UPDATE ${tabla}
    SET token_recuperacion = $1,
        token_recuperacion_expiracion = $2
    WHERE correo = $3
  `;
  await pool.query(consulta, [token, expiracion, correo]);
};

// Buscar usuario o entrenador por token de recuperación
exports.buscarPorTokenRecuperacion = async (token, tipo) => {
  const tabla = tipo === "entrenador" ? "entrenadores" : "usuarios";
  const consulta = `
    SELECT * FROM ${tabla}
    WHERE token_recuperacion = $1
      AND token_recuperacion_expiracion > NOW()
  `;
  const resultado = await pool.query(consulta, [token]);
  return resultado.rows[0];
};

// Cambiar contraseña usando token de recuperación
exports.cambiarContrasenaPorRecuperacion = async (id, nuevaContrasena, tipo) => {
  const tabla = tipo === "entrenador" ? "entrenadores" : "usuarios";
  const idColumn = tipo === "entrenador" ? "id_entrenador" : "id_usuario";
  const consulta = `
    UPDATE ${tabla}
    SET contrasena = $1,
        token_recuperacion = NULL,
        token_recuperacion_expiracion = NULL
    WHERE ${idColumn} = $2
  `;
  await pool.query(consulta, [nuevaContrasena, id]);
};
