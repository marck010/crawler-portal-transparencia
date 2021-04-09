# crawler-portal-transparencia

Busca dados de servidores no portal da transparencia e salva em banco de dados

## Dependências

- Node >= 14
- Npm >= 6
- Docker >= 19

## Database

- Inicializar server em Docker

```
  mkdir -p ~/mongodb/data &&
  docker run -d \
  --name mongodb \
  --restart=unless-stopped \
  --log-opt max-size=200m --log-opt max-file=5\
  -v ~/mongodb/data:/data/db \
  -p 27017:27017 \
  mongo:4.4.5 
```

- Nome do banco - `db-data`
- Colection - `military`

## Aplicação

### Instalar dependências

```npm install```

### Inicializar 

```npm start```

### Rotas da api

- Insere dads no base

  ```POST /data/insert/```

- Lista dados salvos na base

  ```GET /data/list/```