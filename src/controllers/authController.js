const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');

// Gera token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id_usuario },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    // Verifica se o email já existe
    const existingUser = await usuarioModel.buscarPorEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const userId = await usuarioModel.criarUsuario(email, senha);
    const user = { id_usuario: userId, email };
    const token = generateToken(user);

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user,
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = await usuarioModel.buscarPorEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login realizado com sucesso!',
      user: { id_usuario: user.id_usuario, email: user.email },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { register, login };
