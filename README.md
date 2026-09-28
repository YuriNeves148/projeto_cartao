# Sistema de Gerenciamento de Faturas de Cartão
Imagine uma pessoa que empresta o próprio cartão de crédito para outras 4 pessoas fazerem compras; como o dono do cartão saberá qual compra foi feita ou por quem foi feita? Como ele vai saber quanto cada pessoa deverá transferir para ele? A ideia dessa aplicação é o dono do cartão poder fazer essa organização de quem e fez compras e quanto gastou.

O projeto foi desenvolvido como projeto pessoal com o objetivo de praticar desenvolvimento backend, frontend, banco de dados, APIs, autenticação e containerização.

# Tecnologias
- Python
- Flask
- MySQL
- JavaScript
- HTML/CSS

# Funcionalidades
- Cadastro e gerenciamento de pessoas
- Cadastro de bancos e lojas
- Registro de compras
- Divisão de compras em parcelas
- Geração e consulta de faturas
- Consulta do histórico de compras
- Registro de reembolsos

Estrutura do projeto
O projeto possui diferentes branches para separar etapas e funcionalidades do desenvolvimento:

main — versão principal do projeto
docker — versão preparada para execução utilizando Docker
autenticação - versão que está em desenvolvimento
apresentacao - utilizada para apresentar as funcionalidades principais do projeto

# Observações
O projeto foi feito para tratar uma deficiência que eu (autor do projeto) gostaria de tratar que seria: mais controle dos gastos do meu cartão de crédito, sendo assim, o banco de dados aceita somente dois bancos, exclusivamente, sendo eles Nubank e C6. Por mais que seja um detalhe que poderia ser resolvido com um simples tratamento no banco de dados, isso influenciaria na arquitetura das páginas e na visualização dos dados, sendo assim, essa falta será tratada ao final da execução da autenticação.

# Execução
Sem Docker
Instale as dependências do projeto e configure a conexão com o banco de dados MySQL.

Depois, execute a aplicação Flask com: 
  python app.py
Acesse o site pelo Live Server no arquivo: 
  index.html

# Banco de dados
O sistema utiliza MySQL para armazenar informações relacionadas a:

Usuários
Pessoas
Bancos
Lojas
Compras
Parcelas
Reembolsos

# Objetivo
O projeto tem como objetivo aplicar, na prática, conceitos de desenvolvimento de aplicações web, incluindo:

Desenvolvimento de APIs REST
Integração entre Flask e MySQL
Modelagem e consultas SQL
Desenvolvimento de interface web
Autenticação e autorização
Controle de versões com Git
Containerização com Docker

# Status
Em desenvolvimento

Novas funcionalidades e melhorias estão sendo implementadas, principalmente na área de autenticação e gerenciamento de usuários.
