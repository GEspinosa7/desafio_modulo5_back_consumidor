const express = require('express');
const { cadastrarConsumidor, obterConsumidor, atualizarConsumidor } = require('./controllers/consumidores');
const { login } = require('./controllers/login');
const loginAuth = require('./filters/filtroLogin');

const router = express();

router.post('/consumidores', cadastrarConsumidor);
router.post('/login_consumidor', login);

router.use(loginAuth);

router.get('/perfil_consumidor', obterConsumidor);
router.put('/atualizar_consumidor', atualizarConsumidor);

module.exports = router;