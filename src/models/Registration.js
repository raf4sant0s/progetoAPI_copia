const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'O evento é obrigatório']
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'O participante é obrigatório']
  },
  status: {
    type: String,
    enum: {
      values: ['confirmada', 'cancelada'],
      message: 'Status deve ser confirmada ou cancelada'
    },
    default: 'confirmada'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Índice composto único para impedir inscrição duplicada
registrationSchema.index({ event: 1, participant: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
