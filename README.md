# Sistema de Gerenciamento de Faturas de Cartão

> Aplicação para organização e controle de compras efetuadas por terceiros em cartão de crédito próprio.

---

## Sobre o Projeto

Imagine uma pessoa que empresta o próprio cartão de crédito para outras 4 pessoas fazerem compras. Como o dono do cartão saberá qual compra foi feita por quem? Como ele saberá quanto cada pessoa deverá transferir para ele?

A ideia desta aplicação é permitir que o dono do cartão organize **quem fez as compras** e **quanto cada um gastou**.

O projeto foi desenvolvido como um projeto pessoal com o objetivo de praticar:
- Desenvolvimento backend e frontend
- Banco de dados e modelagem SQL
- Criação e consumo de APIs
- Autenticação e autorização
- Containerização com Docker

---

## Tecnologias Utilizadas

- **Linguagens:** Python, JavaScript, HTML5, CSS3
- **Framework:** Flask
- **Banco de Dados:** MySQL

---

## Funcionalidades

- **Gerenciamento:** Cadastro e gerenciamento de pessoas, bancos e lojas.
- **Compras:** Registro de compras e divisão em parcelas.
- **Faturas:** Geração, consulta de faturas e histórico de compras.
- **Reembolsos:** Registro e controle de pagamentos/reembolsos.

---

## Estrutura de Branches

O projeto possui diferentes *branches* para separar etapas e funcionalidades do desenvolvimento:

- `main` — Versão principal do projeto
- `docker` — Versão preparada para execução utilizando Docker
- `autenticação` — Versão em desenvolvimento para sistema de login
- `apresentacao` — Utilizada para apresentar as funcionalidades principais

---

## Observações Importantes

> O projeto foi feito para solucionar uma necessidade específica do autor: ter mais controle dos gastos do próprio cartão de crédito.

Por conta disso, o banco de dados atualmente aceita apenas **dois bancos específicos**: **Nubank** e **C6 Bank**. 

*Nota: Essa limitação afeta a arquitetura das páginas e a visualização dos dados, e será tratada logo após a conclusão do módulo de autenticação.*

---

## Como Executar o Projeto

### Sem Docker

1. Instale as dependências do projeto com o comando:
  ```bash
  pip install -r requirements.txt
```
3. Configure as credenciais e a conexão com o banco de dados MySQL.
4. Execute a aplicação Flask:
   ```bash
   python app.py
   ```
