const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de produtos exigem autenticação estrita
router.use(authMiddleware);

router.get('/', produtoController.listarProdutos);
router.get('/:id', produtoController.buscarProduto);
router.post('/', produtoController.criarProduto);
router.put('/:id', produtoController.atualizarProduto);
router.delete('/:id', produtoController.deletarProduto);

module.exports = router;
