CREATE TABLE IF NOT EXISTS consumidor (
  	id SERIAL NOT NULL PRIMARY KEY,
  	nome VARCHAR(100) NOT NULL,
  	email VARCHAR(100) NOT NULL,
  	senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pedido (
	id SERIAL NOT NULL PRIMARY KEY,
	subtotal INTEGER,
	taxa_entrega INTEGER,
	valor_total INTEGER,
	restaurante_id INTEGER NOT NULL,
	consumidor_id INTEGER NOT NULL,
	FOREIGN KEY(consumidor_id) REFERENCES consumidor(id),
	FOREIGN KEY(restaurante_id) REFERENCES restaurante(id)
);

CREATE TABLE IF NOT EXISTS produto_pedido (
	produto_id INTEGER NOT NULL,
	pedido_id INTEGER NOT NULL,
	preco INTEGER NOT NULL,
	quantidade INTEGER,
	preco_total INTEGER,
	FOREIGN KEY(produto_id) REFERENCES produto(id),
  FOREIGN KEY(pedido_id) REFERENCES pedido(id)
);


CREATE TABLE IF NOT EXISTS endereco (
	id SERIAL NOT NULL PRIMARY KEY,
	endereco TEXT NOT NULL,
	cep VARCHAR(9) NOT NULL,
	complemento TEXT,
	consumidor_id INTEGER NOT NULL,
	FOREIGN KEY(consumidor_id) REFERENCES consumidor(id),
);

