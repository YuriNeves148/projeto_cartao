# Projeto Cartão

Aplicação para controle de compras, parcelas e faturas de cartão de crédito, dividida em três partes: frontend, backend (Flask) e banco de dados (MySQL), todas rodando via Docker.

## Stack

- **Frontend:** HTML, CSS e JavaScript puro, servido por Nginx
- **Backend:** Python (Flask), com CORS habilitado
- **Banco de dados:** MySQL 8.0
- **Orquestração:** Docker Compose

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) (já incluso no Docker Desktop e nas versões recentes do Docker Engine)

## Estrutura do projeto

```
projeto_cartao/
├── backend/
│   ├── routes/          # Blueprints do Flask (compra, criacao, home, individual, parcela, raiz)
│   ├── app.py            # Ponto de entrada da aplicação Flask
│   ├── dockerfile
│   └── requirements.txt
├── bancodedados/          # Scripts .sql com a estrutura do banco (referência)
├── estilizacao/           # Arquivos CSS
├── script/                # Arquivos JS por página (home, criacao, individual, compra)
├── index.html
├── script.js
├── docker-compose.yml
└── README.md
```

## Como rodar o projeto

### 1. Subir os containers

Na raiz do projeto:

```bash
docker compose up -d --build
```

Isso vai:

- Construir a imagem do backend (Python/Flask)
- A imagem do frontend utiliza nginx:alpine e monta os arquivos estáticos do projeto no container.
- Baixar a imagem do MySQL 8.0
- Subir os três containers conectados na mesma rede

### 2. Verificar se os containers estão de pé

```bash
docker ps
```

Você deve ver três containers rodando:

- `projeto_cartao_frontend`
- `projeto_cartao_backend`
- `projeto_cartao_mysql`

### 3. Acessar a aplicação

Abra no navegador:

```
http://localhost:8080
```

O backend fica exposto em `http://localhost:5000` e o MySQL em `localhost:3306` (útil para conectar com um cliente externo, como MySQL Workbench ou DBeaver).

## Importar dados existentes no banco (opcional)

Se você tiver um dump `.sql` com dados (por exemplo, na pasta `dados_banco_de_dados/`), com os containers já rodando:

```bash
for f in dados_banco_de_dados/*.sql; do
  docker exec -i projeto_cartao_mysql mysql -uroot -p proj_cartao4 < "$f"
done
```

> Se der erro de foreign key, importe os arquivos em ordem manualmente, respeitando as dependências entre tabelas (ex: `pessoa` antes de `compra`).

## Persistência de dados

Os dados do MySQL são armazenados em um **volume nomeado** (`mysql_data`), então eles sobrevivem a `docker compose down` e `docker compose up`.

```bash
docker compose down      # remove os containers, mantém os dados
docker compose up -d     # recria os containers, dados continuam lá
```

**Cuidado:** o comando abaixo apaga os dados do banco de propósito — use só se quiser resetar tudo:

```bash
docker compose down -v
```

## Desenvolvimento

O backend usa um **bind mount** (`./backend:/app`), então alterações no código Python refletem automaticamente dentro do container, sem precisar rebuildar a imagem. Como o Flask roda em modo debug (`debug=True`), o servidor reinicia sozinho a cada alteração salva.

O frontend, por outro lado, é **copiado** para dentro da imagem no build (Nginx). Alterações em `index.html`, `script.js`, `script/` ou `estilizacao/` exigem rebuild:

```bash
docker compose up -d --build frontend
```

## Comandos úteis

| Ação                              | Comando                                                                     |
| --------------------------------- | --------------------------------------------------------------------------- |
| Ver logs do backend               | `docker logs -f projeto_cartao_backend`                                     |
| Ver logs do MySQL                 | `docker logs -f projeto_cartao_mysql`                                       |
| Entrar no container do MySQL      | `docker exec -it projeto_cartao_mysql mysql -uroot -p proj_cartao4` |
| Parar tudo                        | `docker compose down`                                                       |
| Parar tudo e apagar dados         | `docker compose down -v`                                                    |
| Reconstruir um serviço específico | `docker compose up -d --build <nome_do_serviço>`                            |
| Ver volumes existentes            | `docker volume ls`                                                          |

### Variáveis de ambiente

As configurações sensíveis do banco de dados são armazenadas em um arquivo `.env`, que não deve ser enviado ao GitHub.

Utilize o arquivo `.env.example` como modelo para criar seu próprio `.env`.

Exemplo:

MYSQL_ROOT_PASSWORD=sua_senha
MYSQL_DATABASE=proj_cartao4
MYSQL_PASSWORD=sua_senha
MYSQL_HOST=mysql
