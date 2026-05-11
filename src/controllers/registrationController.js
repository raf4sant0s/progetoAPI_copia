const Registration = require('../models/Registration');
const Event = require('../models/Event');

// POST /api/registrations — Inscrever-se em um evento
const createRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'O ID do evento é obrigatório.' });
    }

    // Verifica se o evento existe e está ativo
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    if (event.status !== 'ativo') {
      return res.status(400).json({ error: 'Este evento não está aceitando inscrições.' });
    }

    // Verifica se ainda há vagas
    const totalRegistrations = await Registration.countDocuments({
      event: eventId,
      status: 'confirmada'
    });

    if (totalRegistrations >= event.maxParticipants) {
      return res.status(400).json({ error: 'Evento lotado. Não há mais vagas disponíveis.' });
    }

    const registration = await Registration.create({
      event: eventId,
      participant: req.user.id
    });

    await registration.populate([
      { path: 'event', select: 'title date location' },
      { path: 'participant', select: 'name email' }
    ]);

    res.status(201).json({
      message: 'Inscrição realizada com sucesso!',
      registration
    });
  } catch (error) {
    // Erro de duplicação (índice único)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Você já está inscrito neste evento.' });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'ID do evento inválido.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/registrations/my — Listar minhas inscrições
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ participant: req.user.id })
      .populate('event', 'title date location category status')
      .sort({ registeredAt: -1 });

    res.json({ total: registrations.length, registrations });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/registrations/event/:eventId — Listar inscritos de um evento
const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId,
      status: 'confirmada'
    })
      .populate('participant', 'name email')
      .sort({ registeredAt: 1 });

    res.json({ total: registrations.length, registrations });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'ID do evento inválido.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE /api/registrations/:id — Cancelar inscrição
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ error: 'Inscrição não encontrada.' });
    }

    // Verifica se o usuário é o dono da inscrição
    if (registration.participant.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Você só pode cancelar suas próprias inscrições.' });
    }

    if (registration.status === 'cancelada') {
      return res.status(400).json({ error: 'Esta inscrição já foi cancelada.' });
    }

    registration.status = 'cancelada';
    await registration.save();

    res.json({ message: 'Inscrição cancelada com sucesso!', registration });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'ID inválido.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  createRegistration,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration
};
