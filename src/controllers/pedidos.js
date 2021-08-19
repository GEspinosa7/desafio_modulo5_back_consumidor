const knex = require('../database/conexao');

const listarPedidos = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurantes = await knex('restaurante').where({ id }).first();
    if (!restaurantes) return res.status(404).json({ erro: "Este restaurante não existe" });

    const pedidos = await knex('pedido').where({ restaurante_id: id });

    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
}

const detalharPedido = async (req, res) => {
  const { idRes, idPed } = req.params;

  try {
    const restaurantes = await knex('restaurante').where({ id: idRes }).first();
    if (!restaurantes) return res.status(404).json({ erro: "Este restaurante não existe" });

    const pedido = await knex('pedido').where({ id: idPed, restaurante_id: idRes }).first();
    if (!pedido) return res.status(404).json({ erro: "Este pedido não existe" });

    const produtosPedido = await knex('produto_pedido').where({ pedido_id: idPed });

    pedido.produtos = produtosPedido;

    return res.status(200).json(pedido);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }

}

const finalizarPedido = async (req, res) => {
  const { consumidor } = req;
  const { id } = req.params;
  const { produtos } = req.body;

  try {
    const restaurante = await knex('restaurante').where({ id }).first();
    if (!restaurante) return res.status(404).json({ erro: "Este restaurante não existe" });

    const produtosRestaurante = await knex('produto').where({ restaurante_id: id });

    const produtosAtivos = [];

    for (const p of produtosRestaurante) {
      if (p.ativo) {
        produtosAtivos.push(p);
      }
    }

    restaurante.produtos = produtosAtivos;

    const pedidoProduto = [];

    for (const x of produtos) {
      for (const y of produtosAtivos) {
        if (x.id === y.id) {
          pedidoProduto.push({
            produto_id: y.id,
            preco: y.preco,
            quantidade: x.quantidade,
            preco_total: y.preco * x.quantidade,
            ativo: y.ativo
          });
        }
      }
    }

    const precos = [];
    for (const item of pedidoProduto) {
      precos.push(item.preco);
    }
    const subtotal = precos.reduce((acc, x) => acc + x);

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
  detalharPedido,
  listarPedidos,
  finalizarPedido
};