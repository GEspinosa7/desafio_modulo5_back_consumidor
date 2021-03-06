const knex = require('../database/conexao');

const finalizarPedido = async (req, res) => {
  const { consumidor } = req;
  const { id } = req.params;
  const { subtotal, produtos } = req.body;

  try {
    const restaurante = await knex('restaurante').where({ id }).first();
    if (!restaurante) return res.status(404).json({ erro: "Este restaurante não existe" });

    const produtosRestaurante = await knex('produto').where({ restaurante_id: id });

    const pedidoProduto = [];

    for (const x of produtos) {
      for (const y of produtosRestaurante) {
        if (x.id == y.id) {
          if (y.ativo === false) {
            return res.status(400).json({
              erro: "Parece que o restaurante desativou este produto antes de você finalizar a compra",
              produto: y
            });
          }
          pedidoProduto.push({
            produto_id: y.id,
            preco: y.preco,
            quantidade: Number(x.quantidade),
            preco_total: y.preco * x.quantidade,
            ativo: y.ativo
          });
        }
      }
    }

    const pedidoDetalhes = {
      restaurante_id: Number(id),
      consumidor_id: consumidor.id,
      subtotal: subtotal,
      taxa_entrega: restaurante.tempo_entrega_minutos,
      valor_total: subtotal + restaurante.tempo_entrega_minutos
    }

    const pedido = await knex("pedido").insert(pedidoDetalhes).returning('*');
    if (!pedido) return res.status(400).json({ erro: 'Não foi possível finalizar este pedido' });

    for (let pp of pedidoProduto) {
      pp = await knex("produto_pedido").insert({ pedido_id: pedido[0].id, produto_id: pp.produto_id, preco: pp.preco, quantidade: pp.quantidade, preco_total: pp.preco_total }).returning('*');
      if (!pp) return res.status(400).json({ erro: 'Não foi possível cadastrar este produto do pedido' });
    }

    pedidoDetalhes.produtos = pedidoProduto;
    pedidoDetalhes.id = pedido[0].id;

    return res.status(200).json(pedidoDetalhes);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }

}

module.exports = {
  finalizarPedido
};