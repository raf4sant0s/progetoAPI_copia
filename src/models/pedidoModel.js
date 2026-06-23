const pool = require('../config/database');

const listarPedidos = async () => {
  const [rows] = await pool.query(
    'SELECT p.*, c.nome AS cliente_nome FROM pedidos p INNER JOIN clientes c ON p.clientes_id_cliente = c.id_cliente'
  );
  return rows;
};

const buscarPedidoPorId = async (id) => {
  const [pedidos] = await pool.query(
    'SELECT p.*, c.nome AS cliente_nome FROM pedidos p INNER JOIN clientes c ON p.clientes_id_cliente = c.id_cliente WHERE p.id_pedido = ?',
    [id]
  );

  if (!pedidos[0]) return null;

  // Busca os itens do pedido (produtos_pedidos)
  const [itens] = await pool.query(
    'SELECT pp.*, pr.nome AS produto_nome FROM produtos_pedidos pp INNER JOIN produtos pr ON pp.produtos_id_produto = pr.id_produto WHERE pp.pedidos_id_pedido = ?',
    [id]
  );

  return { ...pedidos[0], itens };
};

const criarPedido = async (data, clientes_id_cliente, itens) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insere o pedido
    const [result] = await connection.query(
      'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)',
      [data, clientes_id_cliente]
    );
    const pedidoId = result.insertId;

    // Insere os itens do pedido (se houver)
    if (itens && itens.length > 0) {
      for (const item of itens) {
        await connection.query(
          'INSERT INTO produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor) VALUES (?, ?, ?, ?)',
          [item.produtos_id_produto, pedidoId, item.quantidade, item.valor]
        );
      }
    }

    await connection.commit();
    return pedidoId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const atualizarPedido = async (id, data, clientes_id_cliente) => {
  const [result] = await pool.query(
    'UPDATE pedidos SET data = ?, clientes_id_cliente = ? WHERE id_pedido = ?',
    [data, clientes_id_cliente, id]
  );
  return result.affectedRows > 0;
};

const deletarPedido = async (id) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Deleta os itens do pedido primeiro (FK)
    await connection.query('DELETE FROM produtos_pedidos WHERE pedidos_id_pedido = ?', [id]);
    // Deleta o pedido
    const [result] = await connection.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarPedido,
  deletarPedido
};
