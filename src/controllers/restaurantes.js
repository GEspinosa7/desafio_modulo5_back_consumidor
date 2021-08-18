const knex = require('../database/conexao');

const listarRestaurantes = async (req, res) => {
  try {
    const restaurantes = await knex('restaurante');

    return res.status(200).json(restaurantes);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

const obterRestaurante = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurantes = await knex('restaurante').where({ id }).first();
    if (!restaurantes) return res.status(404).json({ erro: "Este restaurante não existe" });

    const produtos = await knex('produto').where({ restaurante_id: id });

    const produtosAtivos = [];

    for (const p of produtos) {
      if (p.ativo) {
        produtosAtivos.push(p);
      }
    }

    restaurantes.produtos = produtosAtivos;

    return res.status(200).json(restaurantes);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
}


module.exports = {
  listarRestaurantes,
  obterRestaurante,
};