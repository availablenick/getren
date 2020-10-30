# Getren
Uma aplicação

## Como utilizar (apenas para desenvolvimento)

### Containers isolados

#### Servidor Flask
Para rodar a aplicação do servidor, vá à raiz do diretório rode:

```bash
  $ docker build -t getren_server ./backend
  $ docker run --rm -it -p 5000:5000 -e "FLASK_RUN_HOST=0.0.0.0" -e "FLASK_ENV=development" -v "$PWD/backend":/app --name getren_server getren_server bash
```

Dentro do container, rode:
```bash
  $ flask run
```

Após isso, vá até http://localhost:5000.

#### Cliente React
Para rodar a aplicação do cliente, vá à raiz do diretório e rode:

```bash
  $ docker run --rm -it -p 3000:3000 -w /app -v "$PWD/client-getren":/app --name getren_client node:12.19.0 bash
```

Dentro do container, rode:
```bash
  $ npm install
  $ npm start
```

Após isso, vá até http://localhost:3000.

### Containers em rede

#### Docker Compose
Vá à raiz do diretório e rode:
```bash
  $ docker-compose up --build
```

Após isso, vá até http://localhost:3000.

#### Manualmente
Se não for possível usar o Docker Compose, crie uma rede do tipo bridge:
```bash
  $ docker network create getren_network
```

Para cada container, inicialize-o conectado à rede. Faça-o na seguinte ordem, dentro da raiz do diretório:

##### Banco de dados:
```bash
  $ docker run --rm -d -e "POSTGRES_DB=getren" -e "POSTGRES_USER=user" -e "POSTGRES_PASSWORD=password" --network getren_network --network-alias database --name getren_database postgres:12
```

##### Servidor Flask:
```bash
  $ docker build -t getren_server ./backend
  $ docker run --rm -it -p 5000:5000 -e "FLASK_RUN_HOST=0.0.0.0" -e "FLASK_ENV=development" --network getren_network --network-alias server -v "$PWD/backend":/app --name getren_server getren_server flask run
```

##### Cliente React:
```bash
  $ docker build -t getren_client ./client-getren
  $ docker run --rm -it -p 3000:3000 --network getren_network --network-alias client -v "$PWD/client-getren":/app --name getren_client getren_client npm start
```

Após isso, vá até http://localhost:3000.
