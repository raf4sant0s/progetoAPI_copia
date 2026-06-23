const categoriaModel = require('../models/categoriaModel');

const listarCategorias = async (req, res) => {
  try {
    const categorias = await categoriaModel.listarCategorias();
    res.json(categorias);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const buscarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await categoriaModel.buscarCategoriaPorId(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    res.json(categoria);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const criarCategoria = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
    }
    const insertId = await categoriaModel.criarCategoria(nome);
    res.status(201).json({ message: 'Categoria criada com sucesso', id_categoria: insertId, nome });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const atualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
    }
    const sucesso = await categoriaModel.atualizarCategoria(id, nome);
    if (!sucesso) {
      return res.status(404).json({ error: 'Categoria não encontrada ou não alterada.' });
    }
    res.json({ message: 'Categoria atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const deletarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await categoriaModel.deletarCategoria(id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }
    res.json({ message: 'Categoria deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  listarCategorias,
  buscarCategoria,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria
};
