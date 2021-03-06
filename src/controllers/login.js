const knex = require('../database/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const schemaLogin = require('../validations/schemas/schemaLogin');

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    await schemaLogin.validate(req.body);

    const consumidor = await knex('consumidor').where({ email }).first();
    if (!consumidor) return res.status(404).json({ erro: 'Este consumidor não foi encontrado' });

    const enderecos = await knex('endereco').where({ consumidor_id: consumidor.id });

    const senhaCorreta = await bcrypt.compare(senha, consumidor.senha);
    if (!senhaCorreta) return res.status(400).json({ erro: "O email ou senha estão incorretos" });

    const token = jwt.sign({ id: consumidor.id }, process.env.SENHA_HASH);

    const { senha: _, ...dadosConsumidor } = consumidor;

    const endereco = enderecos[enderecos.length - 1];

    return res.status(200).json({
      consumidor: dadosConsumidor,
      endereco,
      token,
    });

  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
}

module.exports = { login }