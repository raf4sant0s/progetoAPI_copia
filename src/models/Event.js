const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'O título é obrigatório'],
    minlength: [3, 'O título deve ter pelo menos 3 caracteres'],
    maxlength: [100, 'O título deve ter no máximo 100 caracteres'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'A descrição é obrigatória'],
    minlength: [10, 'A descrição deve ter pelo menos 10 caracteres'],
    maxlength: [1000, 'A descrição deve ter no máximo 1000 caracteres'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'A data do evento é obrigatória'],
    validate: {
      validator: function (value) {
        return value > new Date();
      },
      message: 'A data do evento deve ser no futuro'
    }
  },
  location: {
    type: String,
    required: [true, 'A localização é obrigatória'],
    trim: true
  },
  maxParticipants: {
    type: Number,
    required: [true, 'O número máximo de participantes é obrigatório'],
    min: [1, 'O evento deve ter pelo menos 1 vaga']
  },
  category: {
    type: String,
    required: [true, 'A categoria é obrigatória'],
    enum: {
      values: ['conferencia', 'workshop', 'seminario', 'meetup', 'outro'],
      message: 'Categoria inválida. Use: conferencia, workshop, seminario, meetup ou outro'
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'O organizador é obrigatório']
  },
  status: {
    type: String,
    enum: {
      values: ['ativo', 'cancelado', 'concluido'],
      message: 'Status inválido. Use: ativo, cancelado ou concluido'
    },
    default: 'ativo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
