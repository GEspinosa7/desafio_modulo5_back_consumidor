const knex = require('../database/conexao');
const jwt = require('jsonwebtoken');

const loginAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(400).json({ erro: 'Token não informado' });

  try {
    const token = authorization.replace('Bearer', '').trim();

    const { id } = jwt.verify(token, process.env.SENHA_HASH);

    const consumidor = await knex('consumidor').where('id', id).first();
    if (!consumidor) return res.status(404).json({ erro: 'Este consumidor não foi encontrado' });

    const { senha: senhaConsumidor, ...dadosConsumidor } = consumidor;

    req.consumidor = dadosConsumidor;

    next();
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

module.exports = loginAuth;