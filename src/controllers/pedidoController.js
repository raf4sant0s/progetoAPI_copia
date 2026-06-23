const pedidoModel = require('../models/pedidoModel');

const listarPedidos = async (req, res) => {
  try {
    const pedidos = await pedidoModel.listarPedidos();
    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const buscarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await pedidoModel.buscarPedidoPorId(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.json(pedido);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const criarPedido = async (req, res) => {
  try {
    const { data, clientes_id_cliente, itens } = req.body;
    if (!data || !clientes_id_cliente) {
      return res.status(400).json({ error: 'Data e ID do cliente são obrigatórios.' });
    }
    const insertId = await pedidoModel.criarPedido(data, clientes_id_cliente, itens);
    res.status(201).json({ message: 'Pedido criado com sucesso.', id_pedido: insertId });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const atualizarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, clientes_id_cliente } = req.body;
    if (!data || !clientes_id_cliente) {
      return res.status(400).json({ error: 'Data e ID do cliente são obrigatórios.' });
    }
    const sucesso = await pedidoModel.atualizarPedido(id, data, clientes_id_cliente);
    if (!sucesso) {
      return res.status(404).json({ error: 'Pedido não encontrado ou não alterado.' });
    }
    res.json({ message: 'Pedido atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const deletarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await pedidoModel.deletarPedido(id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.json({ message: 'Pedido deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  listarPedidos,
  buscarPedido,
  criarPedido,
  atualizarPedido,
  deletarPedido
};
