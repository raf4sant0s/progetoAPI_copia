const Event = require('../models/Event');

// POST /api/events — Criar evento
const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user.id
    };

    const event = await Event.create(eventData);
    res.status(201).json({
      message: 'Evento criado com sucesso!',
      event
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/events — Listar todos os eventos
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    res.json({ total: events.length, events });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/events/:id — Buscar evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    res.json(event);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'ID inválido.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/events/:id — Atualizar evento (somente organizador)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    // Verifica se o usuário é o organizador
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Apenas o organizador pode editar este evento.' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');

    res.json({
      message: 'Evento atualizado com sucesso!',
      event: updatedEvent
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'ID inválido.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// DELETE /api/events/:id — Deletar evento (somente organizador)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado.' });
    }

    // Verifica se o usuário é o organizador
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Apenas o organizador pode deletar este evento.' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Evento deletado com sucesso!' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'ID inválido.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
