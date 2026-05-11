const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Todas as rotas de eventos requerem autenticação
router.use(auth);

// POST /api/events — Criar evento
router.post('/', createEvent);

// GET /api/events — Listar todos os eventos
router.get('/', getAllEvents);

// GET /api/events/:id — Buscar evento por ID
router.get('/:id', getEventById);

// PUT /api/events/:id — Atualizar evento
router.put('/:id', updateEvent);

// DELETE /api/events/:id — Deletar evento
router.delete('/:id', deleteEvent);

module.exports = router;
