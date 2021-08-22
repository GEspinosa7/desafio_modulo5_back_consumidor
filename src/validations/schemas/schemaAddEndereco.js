const yup = require('../configuracoes');

const schemaAddEndereco = yup.object().shape({
  endereco: yup.string().required(),
  cep: yup.required(),
  complemento: yup.string()
});

module.exports = schemaAddEndereco;