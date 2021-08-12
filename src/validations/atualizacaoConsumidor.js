const validarAtualizacaoConsumidor = ({ nome, email, telefone, senha }) => {
  if (nome === null || nome === '') return 'Campo nome não pode ser valor nulo';
  if (email === null || email === '') return 'Campo email não pode ter valor nulo';
  if (telefone === null || telefone === '') return 'Campo telefone não pode ter valor nulo';
  if (senha === null || senha === '') return 'Campo senha não pode ter valor nulo';
}

module.exports = validarAtualizacaoConsumidor;