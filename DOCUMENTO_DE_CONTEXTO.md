# Documento de Contexto do Projeto Pizzaria

**📚 Documentação Detalhada dos Endpoints:** Consulte o arquivo [`endpoints.md`](endpoints.md) para a documentação completa de todos os 17 endpoints com exemplos de requisição/resposta, validações e códigos de erro.

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Tecnologias e versões](#2-tecnologias-e-versões-principais)
3. [Organização de pastas](#3-organização-de-pastas)
4. [Arquitetura de execução](#4-arquitetura-de-execução)
5. [Endpoints completos](#5-endpoints-completos)
6. [Organização de Controllers e Services](#6-organização-de-controllers-e-services)
7. [Validação de dados (schemas)](#7-validação-de-dados-schemas)
8. [Middlewares](#8-middlewares)
9. [Tratamento de Erros](#9-tratamento-de-erros)
10. [Upload de Imagens](#10-upload-de-imagens)
11. [Modelagem do banco de dados](#11-modelagem-do-banco-de-dados-prisma)
12. [Configuração do Prisma e banco](#12-configuração-do-prisma-e-banco)
13. [Variáveis de ambiente](#13-variáveis-de-ambiente)
14. [Observações importantes](#14-observações-importantes)
15. [Script de execução](#15-script-de-execução)

---

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

## 5. Endpoints completos

### ✅ Usuário (User)

| Método | Rota | Função | Autenticação | Autorização |
|--------|------|--------|--------------|-------------|
| POST | `/users` | Criar novo usuário | ❌ | ❌ |
| POST | `/session` | Autenticação (Login) | ❌ | ❌ |
| GET | `/me` | Detalhes do usuário autenticado | ✅ JWT | Qualquer |

**Controllers & Services:**
- `CreateUserController` → `CreateUserService`
- `AuthUserController` → `AuthUserService`
- `DetailUserController` → `DetailUserService`

---

### ✅ Categoria (Category)

| Método | Rota | Função | Autenticação | Autorização |
|--------|------|--------|--------------|-------------|
| POST | `/category` | Criar categoria | ✅ JWT | ADMIN |
| GET | `/category` | Listar todas as categorias | ✅ JWT | Qualquer |

**Controllers & Services:**
- `CreateCategoryController` → `CreateCategoryService`
- `ListCategoryController` → `ListCategoryService`

---

### ✅ Produtos (Product)

| Método | Rota | Função | Autenticação | Autorização |
|--------|------|--------|--------------|-------------|
| POST | `/product` | Criar produto com imagem | ✅ JWT | ADMIN |
| GET | `/products` | Listar produtos (com filtro por status) | ✅ JWT | Qualquer |
| GET | `/category/product/` | Listar produtos por categoria | ✅ JWT | Qualquer |
| DELETE | `/product` | Deletar produto | ✅ JWT | ADMIN |

**Controllers & Services:**
- `CreateProductController` → `CreateProductService`
- `ListProductController` → `ListProductService`
- `ListProductByCategoryController` → `ListProductByCategoryService`
- `DeleteProductController` → `DeleteProductService`

---

### ✅ Pedidos (Order)

| Método | Rota | Função | Autenticação | Autorização |
|--------|------|--------|--------------|-------------|
| POST | `/order` | Criar pedido | ✅ JWT | Qualquer |
| GET | `/orders` | Listar todos os pedidos | ✅ JWT | Qualquer |
| POST | `/order/add` | Adicionar item ao pedido | ✅ JWT | Qualquer |
| DELETE | `/order/remove` | Remover item do pedido | ✅ JWT | Qualquer |
| GET | `/order/detail` | Obter detalhes do pedido | ✅ JWT | Qualquer |
| PUT | `/order/send` | Enviar pedido para cozinha | ✅ JWT | Qualquer |
| PUT | `/order/finish` | Finalizar pedido | ✅ JWT | Qualquer |
| DELETE | `/order` | Deletar pedido | ✅ JWT | Qualquer |

**Controllers & Services:**
- `CreateOrderController` → `CreateOrderService`
- `ListOrderController` → `ListOrderService`
- `AddItemOrderController` → `AddItemOrderService`
- `RemoveItemOrderController` → `RemoveItemOrderService`
- `DetailOrderController` → `DetailOrderService`
- `SendOrderController` → `SendOrderService`
- `FinishOrderController` → `FinishOrderService`
- `DeleteOrderController` → `DeleteOrderService`

## 6. Organização de Controllers e Services

### Controllers

Os controllers estão organizados por domínio:

```
src/controllers/
├── category/
│   ├── CreateCategoryController.ts
│   └── ListCategoryController.ts
├── Order/
│   ├── AddItemOrderController.ts
│   ├── CreateOrderController.ts
│   ├── DeleteOrderController.ts
│   ├── DetailOrderController.ts
│   ├── FinishOrderController.ts
│   ├── ListOrderController.ts
│   ├── RemoveItemOrderController.ts
│   └── SendOrderController.ts
├── Product/
│   ├── CreateProductController.ts
│   ├── DeleteProductController.ts
│   ├── ListProductByCategoryController.ts
│   └── ListProductController.ts
└── user/
    ├── AuthUserController.ts
    ├── CreateUserController.ts
    └── DetailUserController.ts
```

### Services

Os services implementam a lógica de negócio:

```
src/services/
├── Category/
│   ├── CreateCategoryService.ts
│   └── ListCategoryService.ts
├── Order/
│   ├── AddItemOrderService.ts
│   ├── CreateOrderService.ts
│   ├── DeleteOrderService.ts
│   ├── DetailOrderService.ts
│   ├── FinishOrderService.ts
│   ├── ListOrderService.ts
│   ├── RemoveItemOrderService.ts
│   └── SendOrdeService.ts
├── Product/
│   ├── CreateProductService.ts
│   ├── DeleteProductService.ts
│   ├── ListProductByCategoryService.ts
│   └── ListProductService.ts
└── user/
    ├── AuthUserService.ts
    ├── CreateUserService.ts
    └── detailUserService.ts
```

---

## 7. Validação de dados (schemas)

### `src/schemas/userSchemas.ts`

- `createUserSchema`: Validação para criação de usuário
  - `name`: string, mínimo 3 caracteres
  - `email`: email válido
  - `password`: string, mínimo 6 caracteres

- `authSchema`: Validação para autenticação
  - `email`: email válido
  - `password`: string obrigatório (mínimo 1 caractere)

### `src/schemas/categorySchema.ts`

- `createCategorySchema`: Validação para criação de categoria
  - `name`: string, mínimo 2 caracteres

### `src/schemas/productSchema.ts`

- `createProductSchema`: Validação para criação de produto
  - `name`: string obrigatório
  - `price`: string numérica (dígitos apenas)
  - `description`: string obrigatória
  - `category_id`: string obrigatória

- `listProductSchema`: Validação para listar produtos
  - `disable`: string opcional ("true" ou "false")

- `listProductByCategorySchema`: Validação para listar produtos por categoria
  - `category_id`: string obrigatória (query param)

### `src/schemas/orderSchema.ts`

- `createOrderSchema`: Validação para criação de pedido
  - `table`: número inteiro obrigatório
  - `name`: string opcional

- `addItemOrderSchema`: Validação para adicionar item
  - `order_id`: string obrigatória
  - `product_id`: string obrigatória
  - `amount`: número inteiro positivo obrigatório

- `removeItemOrderSchema`: Validação para remover item
  - `item_id`: string obrigatória (query param)

- `detailOrderSchema`: Validação para detalhe do pedido
  - `order_id`: string obrigatória (query param)

- `sendOrderSchema`: Validação para enviar pedido
  - `order_id`: string obrigatória
  - `name`: string obrigatória

- `finishOrderSchema`: Validação para finalizar pedido
  - `order_id`: string obrigatória

- `deleteOrderSchema`: Validação para deletar pedido
  - `order_id`: string obrigatória (query param)

## 8. Middlewares

### `validateSchema.ts`

- Valida os dados da requisição usando schemas Zod
- Verifica `req.body`, `req.query` e `req.params`
- Retorna HTTP 400 com detalhes dos erros em caso de falha
- Usado em quase todos os endpoints

### `isAuthenticated.ts`

- Verifica se o cabeçalho `Authorization` existe
- Extrai o token Bearer do formato `Bearer <token>`
- Valida o JWT usando `process.env.JWT_SECRET`
- Atribui `req.user_id` a partir do `sub` do token
- Retorna HTTP 401 em caso de token faltante ou inválido

### `isAdmin.ts`

- Busca o usuário autenticado no banco via `req.user_id`
- Verifica se o campo `role` é `ADMIN`
- Retorna HTTP 401 se não for administrador
- **Dependência:** Deve ser usado após `isAuthenticated`

---

## 9. Tratamento de Erros

### Middleware de erro global (`src/server.ts`)

- Captura todas as exceções da aplicação
- Se for instância de `Error`, retorna status 400 com `error.message`
- Caso contrário, retorna status 500 com mensagem genérica
- Registra logs de erro no console

---

## 10. Upload de Imagens

### Configuração Multer (`src/config/multer.ts`)

- Configuração para armazenar imagens em buffer
- Usado no endpoint `POST /product`
- As imagens são enviadas para Cloudinary após upload

### Integração Cloudinary (`src/config/cloudinary.ts`)

- Autentica com Cloudinary usando variáveis de ambiente
- Armazena imagens na pasta `products`
- Gera URLs seguras (`secure_url`) para as imagens
- Retorna a URL da imagem após upload bem-sucedido

---

## 11. Modelagem do banco de dados (Prisma)

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

## 12. Configuração do Prisma e banco

- `src/prisma/index.ts` importa `dotenv/config`
- Usa `PrismaClient` gerado em `generated/prisma/client.js`
- Usa `PrismaPg` como adaptador PostgreSQL
- A conexão usa `process.env.DATABASE_URL`

## 13. Variáveis de ambiente

- `PORT` - porta da aplicação
- `DATABASE_URL` - string de conexão PostgreSQL
- `JWT_SECRET` - segredo para assinar tokens JWT

## 14. Observações importantes

- O controller não usa tratamento de exceção específico; erros são propagados para o middleware global
- A rota `POST /category` exige autenticação e autorização de administrador
- O serviço de autenticação retorna token JWT com validade de 30 dias
- O serviço de criação de usuário retorna o usuário sem o campo `password`

## 15. Script de execução

- `npm run dev` - inicia a aplicação com `tsx watch src/server.ts`
