const pool = require('../config/database');

const listarClientes = async () => {
  const [rows] = await pool.query('SELECT * FROM clientes');
  return rows;
};

const buscarClientePorId = async (id) => {
  const [rows] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
  return rows[0];
};

const criarCliente = async (nome, telefone, status) => {
  const [result] = await pool.query(
    'INSERT INTO clientes (nome, telefone, status) VALUES (?, ?, ?)',
    [nome, telefone, status || 'medio']
  );
  return result.insertId;
};

const atualizarCliente = async (id, nome, telefone, status) => {
  const [result] = await pool.query(
    'UPDATE clientes SET nome = ?, telefone = ?, status = ? WHERE id_cliente = ?',
    [nome, telefone, status, id]
  );
  return result.affectedRows > 0;
};

const deletarCliente = async (id) => {
  const [result] = await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  listarClientes,
  buscarClientePorId,
  criarCliente,
  atualizarCliente,
  deletarCliente
};
