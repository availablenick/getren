# Getren
Uma aplicação

## Como utilizar (apenas para desenvolvimento)

### Servidor Flask
Para rodar a aplicação do servidor, vá ao diretório ***backend*** e rode:

```bash
  $ docker build -t server .
  $ docker run --rm -it -p 5000:5000 --mount type=bind,src="$PWD",dst=/app --name server server
```

Dentro do container, rode:
```bash
  $ export FLASK_RUN_HOST=0.0.0.0
  $ flask run
```

Após isso, vá até http://localhost:5000.

### Cliente React
Para rodar a aplicação do cliente, vá até o diretório ***client-getren*** e rode:

```bash
  $ docker build -t client .
  $ docker run --rm -it -p 3000:3000 --mount type=bind,src="$PWD",dst=/app --name client client
```

Dentro do container, rode:
```bash
  $ yarn start
```

Após isso, vá até http://localhost:3000.
