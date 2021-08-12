const knex = require('../database/conexao');
const bcrypt = require('bcrypt');
const schemaCadastroConsumidor = require("../validations/schemas/schemaCadastroConsumidores");
const validarAtualizacaoConsumidor = require('../validations/atualizacaoConsumidor');

const cadastrarConsumidor = async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    await schemaCadastroConsumidor.validate(req.body);

    const consumidorEncotrado = await knex("consumidor").where({ email }).first();
    if (consumidorEncotrado) return res.status(409).json({ erro: "Este email ja está cadastrado" });

    const cryptSenha = await bcrypt.hash(senha, 10);

    const consumidor = await knex("consumidor").insert({ nome, email, telefone, senha: cryptSenha }).returning('*');
    if (!consumidor) return res.status(400).json({ erro: 'Não foi possível cadastrar este consumdior' });

    const { senha: _, ...dadosConsumidor } = consumidor[0];

    return res.status(200).json(dadosConsumidor);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }

};

const atualizarConsumidor = async (req, res) => {
  const { consumidor } = req;
  const { nome, email, telefone, senha } = req.body;

  const erro = validarAtualizacaoConsumidor(req.body);
  if (erro) return res.status(400).json({ erro: erro });

  try {
    if (email) {
      const emailExistente = await knex("consumidor").where({ email }).whereNot({ id: consumidor.id }).first();
      if (emailExistente) return res.status(409).json({ erro: "Este email ja está cadastrado" });
    }

    let novosDadosConsumidor;
    if (senha) {
      const cryptSenha = await bcrypt.hash(senha, 10);
      novosDadosConsumidor = await knex('consumidor').update({ nome, email, telefone, senha: cryptSenha }).where({ id: consumidor.id }).returning('*');
    } else {
      novosDadosConsumidor = await knex('consumidor').update({ nome, email, telefone }).where({ id: consumidor.id }).returning('*');
    }
    if (novosDadosConsumidor.rowCount === 0) return res.status(400).json({ Erro: 'Não foi possível atualizar este consumidor' });

    const { senha: _, ...dadosConsumidor } = novosDadosConsumidor[0];

    return res.status(200).json(dadosConsumidor);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterConsumidor = async (req, res) => {
  const { consumidor } = req;

  try {
    const consumidorPerfil = await knex('consumidor').where('id', consumidor.id).first();

    return res.status(200).json(consumidorPerfil);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarConsumidor,
  atualizarConsumidor,
  obterConsumidor
};