const pool = require('../db');

exports.crearUsuario = async ({ nombre, correo, contrasena, rol }) => {
  const consulta = `
    INSERT INTO usuarios (nombre, correo, contrasena, rol)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const valores = [nombre, correo, contrasena, rol];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
  
};

exports.actualizarUsuario = async ({ id_usuario, nombre, correo }) => {
  const consulta = `
    UPDATE usuarios
    SET nombre = $1, correo = $2
    WHERE id_usuario = $3
    RETURNING id_usuario, nombre, correo, rol
  `;
  const resultado = await pool.query(consulta, [nombre, correo, id_usuario]);
  return resultado.rows[0];
};