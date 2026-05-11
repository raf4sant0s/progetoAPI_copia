const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sanitize = require('./middlewares/sanitize');

const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(sanitize);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API de Gestão de Eventos funcionando!' });
});

// Rotas da API
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);
const registrationRoutes = require('./routes/registrationRoutes');
app.use('/api/registrations', registrationRoutes);

module.exports = app;
