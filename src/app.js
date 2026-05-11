const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API de Gestão de Eventos funcionando!' });
});

// Rotas da API
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/registrations', registrationRoutes);

module.exports = app;
