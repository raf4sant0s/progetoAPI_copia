const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validação estrita: O ID do usuário deve estar no payload do token
    if (!decoded || !decoded.id) {
      return res.status(403).json({ error: 'Proibido. ID do usuário não encontrado no token.' });
    }

    // Se estiver usando cabecalho extra para validar (opcional, mas adicionando robustez)
    const userIdHeader = req.headers['x-user-id'];
    if (userIdHeader && String(userIdHeader) !== String(decoded.id)) {
      return res.status(403).json({ error: 'Proibido. ID do cabeçalho não corresponde ao dono do token.' });
    }

    // Atribui o id do usuário na requisição para uso nos controllers
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;
