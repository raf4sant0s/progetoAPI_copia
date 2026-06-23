require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`MySQL conectado com sucesso!`);
    connection.release();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(`Erro ao conectar ao MySQL: ${error.message}`);
    process.exit(1);
  }
};

startServer();
