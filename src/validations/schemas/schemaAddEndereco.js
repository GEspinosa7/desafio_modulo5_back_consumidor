const yup = require('../configuracoes');

const schemaAddEndereco = yup.object().shape({
  endereco: yup.string(),
  cep: yup.string(),
  complemento: yup.string()
});

module.exports = schemaAddEndereco;