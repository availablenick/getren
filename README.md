# Getren
Uma aplicação

## Uso

- [Com Docker](#Com-Docker)
- [Sem Docker](#Sem-Docker)

### Com Docker

Instale o [docker-compose](https://docs.docker.com/compose/install/). Vá à raiz do diretório e rode:
```
  $ docker-compose up
```

Após isso, vá até http://localhost:3000.

### Sem Docker

- Instale o [PostgreSQL 12](https://www.postgresql.org/download/linux/debian/).
- Instale as dependências especificadas no arquivo requirements.txt presente no repositório.
- Instale o [npm](https://github.com/nodesource/distributions#debinstall).


Cheque se o postgres está ativo:
```
  $ sudo systemctl status postgresql
```

Se não estiver, inicie-o:
```
  $ sudo systemctl start postgresql
```

Entre no diretório __*server*__, instale as dependências, execute as migrations pela primeira vez e inicie o servidor:

```
  $ pip install requirements.txt
  $ flask db upgrade
  $ flask run
```

Em outro terminal, entre no diretório __*client*__ instale as dependências e inicie o cliente:
```
  $ npm install
  $ npm start
```

Após isso, vá até http://localhost:3000.

## Testes

- [Testes com Docker](#Testes-com-Docker)
- [Testes sem Docker](#Testes-sem-Docker)

### Testes com Docker

#### Servidor

##### Modelos
Em outro terminal, após iniciar os containers, rode:
```
  $ docker-compose exec server python3 test.py
```

##### Rotas
Em outro terminal, após iniciar os containers, rode:
```
  $ docker run --rm -it --net host -v "$PWD":/etc/newman --name postman postman/newman:5.2.1 run ./postman_collection.json
```

#### Cliente
Em outro terminal, após iniciar os containers, rode:
```
  $ docker run --rm -it --net host -v "$PWD/client":/app -w /app --name cypress cypress/included:6.1.0
```

### Testes sem Docker

#### Instalação das ferramentas

É necessário instalar as seguintes aplicações:
- [Cypress 6.1.0](https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements)
- [Postman/newman 5.2.1](https://learning.postman.com/docs/getting-started/installation-and-updates/#installing-postman-on-linux)

#### Servidor

##### Modelos
Em outro terminal, após iniciar o cliente e o servidor, entre no diretório __*server*__ e rode:
```
  $ python3 test.py
```

##### Rotas
Em outro terminal, após iniciar o cliente e o servidor, entre no diretório __*server*__ e rode:
```
  $ newman run postman_collection.json
```

#### Cliente
Em outro terminal, após iniciar o cliente e o servidor, entre no diretório __*client*__ e rode:
```
  $ npx cypress run
```
