const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de categorias exigem autenticação estrita
router.use(authMiddleware);

router.get('/', categoriaController.listarCategorias);
router.get('/:id', categoriaController.buscarCategoria);
router.post('/', categoriaController.criarCategoria);
router.put('/:id', categoriaController.atualizarCategoria);
router.delete('/:id', categoriaController.deletarCategoria);

module.exports = router;
