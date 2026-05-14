# Documento de Contexto do Projeto Pizzaria

## 1. Visão Geral

Este projeto é um backend Node.js escrito em TypeScript usando arquitetura baseada em rotas, controllers, services e Prisma ORM para acesso ao banco de dados PostgreSQL.

A arquitetura principal segue o fluxo:

- Rotas recebem a requisição HTTP
- Controllers processam a requisição e chamam os Services
- Services fazem a lógica de negócio e acessam o banco via Prisma
- Controllers retornam a resposta ao cliente

## 2. Tecnologias e versões principais

- Node.js / TypeScript
- Express 5.2.1
- Prisma 7.8.0
- @prisma/client 7.8.0
- @prisma/adapter-pg 7.8.0
- PostgreSQL (conexão via `pg` 8.20.0)
- Zod 4.4.3
- bcryptjs 3.0.3
- jsonwebtoken 9.0.3
- cors 2.8.6
- dotenv 17.4.2
- tsx 4.21.0

Dev dependencies:

- typescript 6.0.3
- @types/cors 2.8.19
- @types/express 5.0.6
- @types/jsonwebtoken 9.0.10
- @types/node 25.6.0
- @types/pg 8.20.0
- prisma 7.8.0

## 3. Organização de pastas

- `src/`
  - `controllers/` - classes que recebem requisições e usam services
    - `category/` - controller de categoria
    - `user/` - controllers de usuário e autenticação
  - `services/` - lógica de negócio e acesso ao banco
    - `Category/`
    - `user/`
  - `middlewares/` - validação, autenticação e autorização
  - `schemas/` - validação de payload via Zod
  - `prisma/` - instância do Prisma Client com adaptador PostgreSQL
  - `generated/` - cliente Prisma gerado
  - `@types/` - definições de tipos adicionais para Express
  - `routes.ts` - registro de rotas e middlewares
  - `server.ts` - inicialização do Express, CORS e tratamento de erro global
- `prisma/`
  - `schema.prisma` - modelagem do banco de dados
  - `migrations/` - histórico de migrações
- `package.json` - dependências e scripts
- `.env` - variáveis de ambiente

## 4. Arquitetura de execução


### Fluxo padrão de uma requisição

1. `src/routes.ts` define a rota e aplica middlewares
2. `validateSchema` valida o corpo da requisição usando schemas Zod
3. `isAuthenticated` valida o token JWT e popula `req.user_id`
4. `isAdmin` valida se o usuário autenticado é administrador
5. O controller específico (`CreateUserController`, `AuthController`, etc.) chama o service
6. O service acessa o banco via `prismaClient` e retorna o resultado
7. O controller envia a resposta JSON ao cliente

## 5. Endpoints atuais

### Usuário

- `POST /users`
  - Cria um novo usuário
  - Validação: `createUserSchema`
  - Execução: `CreateUserController` → `CreateUserService`

- `POST /session`
  - Autenticação de usuário
  - Validação: `authSchema`
  - Execução: `AuthController` → `AuthUserService`

- `GET /me`
  - Retorna dados do usuário autenticado
  - Requer autenticação JWT
  - Execução: `DetailUserController` → `DetailUserSevice`

### Categoria

- `POST /category`
  - Cria nova categoria
  - Requer autenticação JWT e role `ADMIN`
  - Validação: `createCategorySchema`
  - Execução: `CreateCategoryController` → `CreateCategoryService`

### Produtos por categoria

- `GET /category/product/:category_id`
  - Retorna todos os produtos de uma categoria específica
  - Requer autenticação JWT
  - Parâmetro: `category_id` no `params`
  - Execução: `ListProductByCategoryController` → `ListProductByCategoryService`

## 6. Validação de dados (schemas)

### `src/schemas/userSchemas.ts`

- `createUserSchema`
  - `name`: string, mínimo 3 caracteres
  - `email`: email válido
  - `password`: string, mínimo 6 caracteres

- `authSchema`
  - `email`: email válido
  - `password`: string obrigatório

### `src/schemas/categorySchema.ts`

- `createCategorySchema`
  - `name`: string, mínimo 2 caracteres

### `src/schemas/productSchema.ts`

- `listProductByCategorySchema`
  - `params.category_id`: string, obrigatório

### Middleware de validação

- `src/middlewares/validateSchema.ts`
  - Recebe um schema Zod e valida `req.body`, `req.query` e `req.params`
  - Em caso de falha retorna HTTP 400 com detalhes dos problemas

## 7. Middlewares

### `isAuthenticated`

- Verifica se o cabeçalho `Authorization` existe
- Extrai o token Bearer
- Verifica o JWT usando `process.env.JWT_SECRET`
- Atribui `req.user_id` a partir do `sub` do token
- Retorna HTTP 401 em caso de token faltante ou inválido

### `isAdmin`

- Busca o usuário autenticado no banco via `req.user_id`
- Verifica se o campo `role` é `ADMIN`
- Retorna HTTP 401 se não for administrador

### Tratamento de erros global

- `src/server.ts` adiciona middleware de erro ao final
- Se a exceção for `Error`, retorna status 400 com `error.message`
- Caso contrário retorna status 500 com mensagem genérica

## 8. Modelagem do banco de dados (Prisma)

### Enum `Role`

- `STAFF`
- `ADMIN`

### Model `User`

- `id`: String UUID
- `name`: String
- `email`: String único
- `password`: String
- `role`: Role (`STAFF` por padrão)
- `createAt`: DateTime padrão `now()`
- `updateAt`: DateTime `@updatedAt`

### Model `Category`

- `id`: String UUID
- `name`: String
- `createAt`: DateTime padrão `now()`
- `updateAt`: DateTime `@updatedAt`
- `products`: relação 1:N com `Product`

### Model `Product`

- `id`: String UUID
- `name`: String
- `price`: Int
- `description`: String
- `banner`: String
- `disabled`: Boolean padrão `false`
- `category_id`: String (FK)
- `category`: relação para `Category`
- `createAt`: DateTime padrão `now()`
- `updateAt`: DateTime `@updatedAt`
- `items`: relação 1:N com `Item`

### Model `Order`

- `id`: String UUID
- `table`: Int
- `status`: Boolean padrão `false`
- `draft`: Boolean padrão `true`
- `name`: String
- `createAt`: DateTime padrão `now()`
- `updateAt`: DateTime `@updatedAt`
- `items`: relação 1:N com `Item`

### Model `Item`

- `id`: String UUID
- `amount`: Int
- `createAt`: DateTime padrão `now()`
- `updateAt`: DateTime `@updatedAt`
- `order_id`: String (FK)
- `product_id`: String (FK)
- `order`: relação para `Order`
- `product`: relação para `Product`

## 9. Configuração do Prisma e banco

- `src/prisma/index.ts` importa `dotenv/config`
- Usa `PrismaClient` gerado em `generated/prisma/client.js`
- Usa `PrismaPg` como adaptador PostgreSQL
- A conexão usa `process.env.DATABASE_URL`

## 10. Variáveis de ambiente

- `PORT` - porta da aplicação
- `DATABASE_URL` - string de conexão PostgreSQL
- `JWT_SECRET` - segredo para assinar tokens JWT

## 11. Observações importantes

- O controller não usa tratamento de exceção específico; erros são propagados para o middleware global
- A rota `POST /category` exige autenticação e autorização de administrador
- O serviço de autenticação retorna token JWT com validade de 30 dias
- O serviço de criação de usuário retorna o usuário sem o campo `password`

## 12. Script de execução

- `npm run dev` - inicia a aplicação com `tsx watch src/server.ts`
