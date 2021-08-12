const knex = require('../database/conexao');

const listarRestaurantes = async (req, res) => {
  try {
    const restaurantes = await knex('restaurante');

    return res.status(200).json(restaurantes);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};


module.exports = { listarRestaurantes };