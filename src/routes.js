const express = require('express');
const { cadastrarConsumidor, obterConsumidor, atualizarConsumidor, addEndereco } = require('./controllers/consumidores');
const { login } = require('./controllers/login');
const { detalharPedido, listarPedidos, finalizarPedido } = require('./controllers/pedidos');
const { detalharProduto } = require('./controllers/produtos');
const { listarRestaurantes, obterRestaurante } = require('./controllers/restaurantes');
const loginAuth = require('./filters/filtroLogin');

const router = express();

router.post('/consumidores', cadastrarConsumidor);
router.post('/login_consumidor', login);

router.use(loginAuth);

router.get('/perfil_consumidor', obterConsumidor);
router.put('/atualizar_consumidor', atualizarConsumidor);
router.put('/add_endereco', addEndereco);

router.get('/restaurantes', listarRestaurantes);
router.get('/restaurantes/:id', obterRestaurante);
router.get('/restaurantes/:idRes/produtos/:idProd', detalharProduto);

router.get('/restaurantes/:id/pedidos', listarPedidos);
router.get('/restaurantes/:idRes/pedidos/:idPed', detalharPedido);
router.post('/restaurantes/:id/pedidos', finalizarPedido);

module.exports = router;