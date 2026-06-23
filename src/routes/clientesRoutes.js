const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas de clientes exigem autenticação estrita
router.use(authMiddleware);

router.get('/', clienteController.listarClientes);
router.get('/:id', clienteController.buscarCliente);
router.post('/', clienteController.criarCliente);
router.put('/:id', clienteController.atualizarCliente);
router.delete('/:id', clienteController.deletarCliente);

module.exports = router;
