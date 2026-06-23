const clienteModel = require('../models/clienteModel');

const listarClientes = async (req, res) => {
  try {
    const clientes = await clienteModel.listarClientes();
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const buscarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await clienteModel.buscarClientePorId(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const criarCliente = async (req, res) => {
  try {
    const { nome, telefone, status } = req.body;
    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
    }
    const insertId = await clienteModel.criarCliente(nome, telefone, status);
    res.status(201).json({ message: 'Cliente criado com sucesso.', id_cliente: insertId, nome, telefone, status: status || 'medio' });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const atualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, status } = req.body;
    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios.' });
    }
    const sucesso = await clienteModel.atualizarCliente(id, nome, telefone, status || 'medio');
    if (!sucesso) {
      return res.status(404).json({ error: 'Cliente não encontrado ou não alterado.' });
    }
    res.json({ message: 'Cliente atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const deletarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await clienteModel.deletarCliente(id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }
    res.json({ message: 'Cliente deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  listarClientes,
  buscarCliente,
  criarCliente,
  atualizarCliente,
  deletarCliente
};
