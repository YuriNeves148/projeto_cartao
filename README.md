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

## Demonstração

<img width="1302" height="810" alt="Captura de tela de 2026-09-03 18-23-32" src="https://github.com/user-attachments/assets/12d4c3a2-a194-4b85-86aa-742aec17726c" />


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

```text
http://localhost:8080
```

A aplicação estará disponível através do frontend (Nginx).

As demais portas ficam disponíveis para acesso aos serviços:

* **Backend (Flask):** `http://localhost:5000`
* **MySQL:** `localhost:3306`

A porta do MySQL pode ser utilizada para conectar ao banco através de ferramentas externas, como MySQL Workbench ou DBeaver.

## Importar dados existentes no banco (opcional)

Na pasta `bancodedados/` há um dump `.sql` contendo dados fictícios utilizados para testes do projeto.

Caso seja necessário importar esses dados manualmente, com os containers em execução, execute:

```bash
for f in bancodedados/*.sql; do
  docker exec -i projeto_cartao_mysql mysql -uroot -p proj_cartao4 < "$f"
done
```

O comando solicitará a senha definida em `MYSQL_ROOT_PASSWORD` no arquivo `.env`.


## Persistência de dados

Os dados do MySQL são armazenados em um **volume Docker nomeado** chamado `mysql_data`.

Para parar os containers:

```bash
docker compose down
```

Para iniciá-los novamente:

```bash
docker compose up -d
```

Os dados existentes no banco serão preservados.

### Resetar o banco de dados

Caso queira apagar completamente os dados do banco e iniciar uma nova instalação:

```bash
docker compose down -v
```

> **Cuidado:** o parâmetro `-v` remove os volumes associados aos containers. Isso apagará os dados armazenados no volume `mysql_data`.


### Variáveis de ambiente

Utilize o arquivo `.env.example` como modelo para criar seu próprio `.env`.

Exemplo:

MYSQL_ROOT_PASSWORD=sua_senha
MYSQL_DATABASE=proj_cartao4
MYSQL_PASSWORD=sua_senha
MYSQL_HOST=mysql

