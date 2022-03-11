# ApiFavoritos_desafio_Euller
A Api gerencia o cadastro de clientes(Cria, atualiza, visualiza e remove).

A Api realiza a adição de produtos favoritados à lista de favoritos de cada cliente, assim como também retorna a listagem destes favoritos de forma paginada. O limite por página são de 3 produtos.

# Sobre
A Api foi desenvolvida utilizando Javascript(NodeJs) e MongoDB.

O cliente não pode se cadastrar ou atualizar o email com um email igual ao de outro cliente.

A paginação de todos os clientes adota um limite de 5 por página.

A paginação de todos os produtos adota um limite de 4 por página.

## Como testar
Com o node instalado em sua máquina, após clonar o repositório GIT execute o seguinte comando para instalação das dependências:

`npm install express nodemon mongoose`

Após a instalação das dependências basta executar a Api com o comando:

`npm start`

Para facilitar os testes foi utilizado o Postman

### Instalação Postman

```https://www.postman.com/downloads/```

### Link para acesso as collections
```https://web.postman.co/workspace/0247dbb2-4054-42a1-825a-da8b71b2f05e```