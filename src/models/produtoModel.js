const pool = require('../config/database');

const listarProdutos = async () => {
  const [rows] = await pool.query(
    'SELECT p.*, c.nome AS categoria_nome FROM produtos p INNER JOIN categorias c ON p.categorias_id_categoria = c.id_categoria'
  );
  return rows;
};

const buscarProdutoPorId = async (id) => {
  const [rows] = await pool.query(
    'SELECT p.*, c.nome AS categoria_nome FROM produtos p INNER JOIN categorias c ON p.categorias_id_categoria = c.id_categoria WHERE p.id_produto = ?',
    [id]
  );
  return rows[0];
};

const criarProduto = async (nome, valor, estoque, categorias_id_categoria) => {
  const [result] = await pool.query(
    'INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)',
    [nome, valor, estoque, categorias_id_categoria]
  );
  return result.insertId;
};

const atualizarProduto = async (id, nome, valor, estoque, categorias_id_categoria) => {
  const [result] = await pool.query(
    'UPDATE produtos SET nome = ?, valor = ?, estoque = ?, categorias_id_categoria = ? WHERE id_produto = ?',
    [nome, valor, estoque, categorias_id_categoria, id]
  );
  return result.affectedRows > 0;
};

const deletarProduto = async (id) => {
  const [result] = await pool.query('DELETE FROM produtos WHERE id_produto = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto
};
