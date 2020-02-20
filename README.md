# FastFeet

Desafio back-end do bootcamp GoStack da Rocketseat

### Objetivo

Aplicar os conceitos dentro do NodeJS de:
- Infraestrutura básica
- Nodemon e Sucrase
- Sequelize
- Eslint, Prettier e Editorconfig
- Migration
- Seed 
- Autenticaço JWT
- Criptografia de senha para armazenamento
- Validação de dados de entrada

### Como rodar o projeto

- Clone o projeto.
- Execute o comando ```npm install``` ou ```yarn``` para instalar as dependências.
- Execute o comando ```docker-compose up``` para subir as dependências de banco de dados (postgres, mongo e redis).
- Execute o comando ```yarn sequelize db:migrate``` para executar as migrations no postgres.
- Execute o comando ```yarn sequelize db:seed:all``` para criar os seeds no postgres.
- Execute o comando ```npm run dev``` ou ```yarn dev``` para executar o projeto.
- Acesse a url ```http://localhost:3000```
