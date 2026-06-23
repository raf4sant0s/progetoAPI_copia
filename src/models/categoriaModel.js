const pool = require('../config/database');

const listarCategorias = async () => {
  const [rows] = await pool.query('SELECT * FROM categorias');
  return rows;
};

const buscarCategoriaPorId = async (id) => {
  const [rows] = await pool.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
  return rows[0];
};

const criarCategoria = async (nome) => {
  const [result] = await pool.query('INSERT INTO categorias (nome) VALUES (?)', [nome]);
  return result.insertId;
};

const atualizarCategoria = async (id, nome) => {
  const [result] = await pool.query('UPDATE categorias SET nome = ? WHERE id_categoria = ?', [nome, id]);
  return result.affectedRows > 0;
};

const deletarCategoria = async (id) => {
  const [result] = await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  listarCategorias,
  buscarCategoriaPorId,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria
};
