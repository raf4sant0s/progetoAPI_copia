const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middlewares globais
app.use(express.json());
app.use(cors());
// Desabilita CSP no helmet para evitar bloqueio de estilos e scripts inline do Swagger UI
app.use(helmet({
  contentSecurityPolicy: false
}));

// Arquivos estáticos (Front-end)
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// Configuração da Rota do Swagger (API Docs)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar .topbar-wrapper {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
    }
  `
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Rotas da API
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const categoriaRoutes = require('./routes/categoriaRoutes');
app.use('/api/categorias', categoriaRoutes);

const produtosRoutes = require('./routes/produtosRoutes');
app.use('/api/produtos', produtosRoutes);

const clientesRoutes = require('./routes/clientesRoutes');
app.use('/api/clientes', clientesRoutes);

const pedidosRoutes = require('./routes/pedidosRoutes');
app.use('/api/pedidos', pedidosRoutes);

module.exports = app;
