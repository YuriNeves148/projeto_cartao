# Sistema de Gerenciamento de Faturas de Cartão

Aplicação web desenvolvida para gerenciamento de **compras, parcelas, faturas e reembolsos de cartões de crédito**.

O projeto foi desenvolvido como projeto pessoal com o objetivo de praticar desenvolvimento **backend, frontend, banco de dados, APIs, autenticação e containerização**.

## Tecnologias

* **Python**
* **Flask**
* **MySQL**
* **JavaScript**
* **HTML/CSS**
* **Docker / Docker Compose**
* **JWT** para autenticação

## Funcionalidades

* Cadastro e gerenciamento de pessoas
* Cadastro de bancos e lojas
* Registro de compras
* Divisão de compras em parcelas
* Geração e consulta de faturas
* Consulta do histórico de compras
* Registro de reembolsos
* Autenticação de usuários com JWT *(em desenvolvimento)*

## Estrutura do projeto

O projeto possui diferentes branches para separar etapas e funcionalidades do desenvolvimento:

* **`main`** — versão principal do projeto
* **`docker`** — versão preparada para execução utilizando Docker
* **branch de desenvolvimento** — versão da aplicação sem containerização

A autenticação utilizando JWT está atualmente em desenvolvimento e será integrada à aplicação principal.

## Execução

### Sem Docker

Instale as dependências do projeto e configure a conexão com o banco de dados MySQL.

Depois, execute a aplicação Flask:

```bash
python app.py
```

### Com Docker

Com o Docker e Docker Compose instalados, execute:

```bash
docker compose up --build
```

As configurações necessárias para conexão com o banco de dados devem ser definidas conforme a configuração do projeto.

## Banco de dados

O sistema utiliza **MySQL** para armazenar informações relacionadas a:

* Usuários
* Pessoas
* Bancos
* Lojas
* Compras
* Parcelas
* Reembolsos

## Objetivo

O projeto tem como objetivo aplicar, na prática, conceitos de desenvolvimento de aplicações web, incluindo:

* Desenvolvimento de APIs REST
* Integração entre Flask e MySQL
* Modelagem e consultas SQL
* Desenvolvimento de interface web
* Autenticação e autorização
* Controle de versões com Git
* Containerização com Docker

## Status

🚧 **Em desenvolvimento**

Novas funcionalidades e melhorias estão sendo implementadas, principalmente na área de **autenticação e gerenciamento de usuários**.
