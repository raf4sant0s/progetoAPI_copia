const produtoModel = require('../models/produtoModel');

const listarProdutos = async (req, res) => {
  try {
    const produtos = await produtoModel.listarProdutos();
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const buscarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await produtoModel.buscarProdutoPorId(id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    res.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const criarProduto = async (req, res) => {
  try {
    const { nome, valor, estoque, categorias_id_categoria } = req.body;
    if (!nome || valor === undefined || categorias_id_categoria === undefined) {
      return res.status(400).json({ error: 'Nome, valor e categoria são obrigatórios.' });
    }
    const insertId = await produtoModel.criarProduto(nome, valor, estoque || 1, categorias_id_categoria);
    res.status(201).json({ message: 'Produto criado com sucesso.', id_produto: insertId, nome, valor, estoque: estoque || 1, categorias_id_categoria });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, valor, estoque, categorias_id_categoria } = req.body;
    if (!nome || valor === undefined || categorias_id_categoria === undefined) {
      return res.status(400).json({ error: 'Nome, valor e categoria são obrigatórios.' });
    }
    const sucesso = await produtoModel.atualizarProduto(id, nome, valor, estoque || 1, categorias_id_categoria);
    if (!sucesso) {
      return res.status(404).json({ error: 'Produto não encontrado ou não alterado.' });
    }
    res.json({ message: 'Produto atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const deletarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await produtoModel.deletarProduto(id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    res.json({ message: 'Produto deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto
};
