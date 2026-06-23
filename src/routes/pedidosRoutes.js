const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de pedidos exigem autenticação estrita
router.use(authMiddleware);

router.get('/', pedidoController.listarPedidos);
router.get('/:id', pedidoController.buscarPedido);
router.post('/', pedidoController.criarPedido);
router.put('/:id', pedidoController.atualizarPedido);
router.delete('/:id', pedidoController.deletarPedido);

module.exports = router;
