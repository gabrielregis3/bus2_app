# Sistema de Visualização de Linhas e Viagens de Ônibus

Este projeto é uma aplicação fullstack desenvolvida com **NestJS (backend)**, **Angular 19 (frontend)**, **Prisma (ORM)**, **MySQL (banco de dados)** e **Google Maps API**, que permite visualizar linhas de ônibus, viagens e paradas em um mapa interativo. Também inclui documentação automática da API com Swagger.

---

## Como rodar o projeto:

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MySQL](https://www.mysql.com/) rodando localmente
- Conta com chave de API do [Google Maps](https://developers.google.com/maps)

---

### Passo a passo para executar o projeto

#### Clone o repositório

```bash
git clone https://github.com/gabrielregis3/bus2_app.git
cd bus2_app
```

---

### Configuração do Backend (NestJS)

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências do backend:

```bash
npm install
```
Gere o client do Prisma:

```bash
npx prisma generate
```

Configure o banco de dados criando um arquivo `.env` com a variável `DATABASE_URL`:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
```

## Abra e rode os Scripts SQL: <br>
`backend/prisma/20250401191657_init/migration.sql` (Para a  criação do banco de dados) <br>`backend/prisma/inserts.sql` (Para popular os dados)

Inicie o servidor backend:

```bash
npm run start:dev
```

> O backend irá rodar em `http://localhost:3000`

---

### Documentação da API (Swagger)

Com o backend rodando, você pode acessar a documentação interativa da API Swagger em:

```
http://localhost:3000/api
```

---

### Configuração do Frontend

Acesse a pasta do frontend:

```bash
cd ../frontend
```

Instale as dependências:

```bash
npm install
```
Configure sua chave da Google Maps API:

No arquivo `frontend/src/environments/environment_example.ts`, altere o nome somente para environment.ts e adicione:

```ts
export const environment = {
  production: false,
  googleMapsApiKey: 'SUA_CHAVE_GOOGLE_MAPS'
};
```

Rode a aplicação Angular:

```bash
ng serve
```

> O frontend será acessado via `http://localhost:4200`

---

### Resumo das URLs:

- Frontend Angular: http://localhost:4200  
- Backend NestJS: http://localhost:3000  
- Swagger API Docs: http://localhost:3000/api

---

### Credenciais de login:

Usuário: admin
Senha: admin

---

### Testes Automatizados (Jest)

O projeto utiliza o Jest para testes unitários no backend. Os testes criados validam os controllers principais: linhas, paradas e viagens.

Acesse a pasta do backend:


```bash
cd backend
```

Testes incluídos:
src/lines/lines.controller.spec.ts – Testa o controller das linhas
```bash
npm run test lines.controller
```
src/stops/stops.controller.spec.ts – Testa o controller das paradas
```bash
npm run test stops.controller
```
src/trips/trips.controller.spec.ts – Testa o controller das viagens
```bash
npm run test
```

--- 

## Funcionalidades

- Listagem de linhas, viagens e paradas
- Busca por nome de linha, viagem ou parada
- Visualização de paradas no mapa com Google Maps
- Exibição de paradas por viagem
- Exibição de viagens por linha ou parada
