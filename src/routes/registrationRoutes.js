const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createRegistration,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration
} = require('../controllers/registrationController');

// Todas as rotas requerem autenticação
router.use(auth);

// POST /api/registrations — Inscrever-se em um evento
router.post('/', createRegistration);

// GET /api/registrations/my — Listar minhas inscrições
router.get('/my', getMyRegistrations);

// GET /api/registrations/event/:eventId — Listar inscritos de um evento
router.get('/event/:eventId', getEventRegistrations);

// DELETE /api/registrations/:id — Cancelar inscrição
router.delete('/:id', cancelRegistration);

module.exports = router;
