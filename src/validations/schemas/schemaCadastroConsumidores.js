const yup = require('../configuracoes');

const schemaCadastroConsumidor = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  telefone: yup.string().required(),
  senha: yup.string().required()
});

module.exports = schemaCadastroConsumidor;