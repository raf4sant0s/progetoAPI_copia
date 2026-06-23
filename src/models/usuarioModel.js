const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const buscarPorEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
};

const criarUsuario = async (email, senha) => {
  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senha, salt);
  const [result] = await pool.query('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, senhaHash]);
  return result.insertId;
};

module.exports = {
  buscarPorEmail,
  criarUsuario
};
