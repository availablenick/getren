# Getren
Uma aplicação

## Usage
Para rodar a aplicação, vá ao diretório onde se encontra o Dockerfile e rode:

```bash
  $ docker build -t getren .
  $ docker run --rm -it -p 5000:5000 --mount type=bind,src="$PWD",dst=/app getren
```
