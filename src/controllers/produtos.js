const knex = require('../database/conexao');

const detalharProduto = async (req, res) => {
  const { idRes, idProd } = req.params;

  try {
    const restaurantes = await knex('restaurante').where({ id: idRes }).first();
    if (!restaurantes) return res.status(404).json({ erro: "Este restaurante não existe" });

    const produto = await knex('produto').where({ id: idProd, restaurante_id: idRes }).first();
    if (!produto) return res.status(404).json({ erro: "Este produto não existe" });

    if (produto.ativo === false) return res.status(404).json({ erro: "Este produto não está ativo no restaurante" });

    return res.status(200).json(produto);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
}



module.exports = {
  detalharProduto
}