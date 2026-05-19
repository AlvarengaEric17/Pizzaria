# 📋 Documentação de Endpoints - Pizzaria API

## 📌 Índice

- [Usuário (User)](#usuário-user)
- [Categoria (Category)](#categoria-category)
- [Produtos (Product)](#produtos-product)
- [Pedidos (Order)](#pedidos-order)

---

## 👤 Usuário (User)

### 1. Criar Usuário

**Endpoint:** `POST /users`

**Autenticação:** ❌ Não requerida  
**Autorização:** ❌ Não requerida  
**Controller:** `CreateUserController`  
**Service:** `CreateUserService`  

**Corpo da Requisição (JSON):**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**
- `name`: string, mínimo 3 caracteres
- `email`: formato de email válido
- `password`: string, mínimo 6 caracteres
- Email deve ser único (não pode haver outro usuário com o mesmo email)

**Resposta de Sucesso (201):**
```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `400`: Email já existente ("Usuário já existente!")
- `400`: Dados inválidos (validação Zod)
- `500`: Erro ao criar usuário

---

### 2. Autenticação (Login)

**Endpoint:** `POST /session`

**Autenticação:** ❌ Não requerida  
**Autorização:** ❌ Não requerida  
**Controller:** `AuthUserController`  
**Service:** `AuthUserService`  

**Corpo da Requisição (JSON):**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**
- `email`: formato de email válido
- `password`: string obrigatória (mínimo 1 caractere)

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Detalhes do Token:**
- Tipo: JWT
- Duração: 30 dias
- Payload contém: `name`, `email`, `sub` (id do usuário)

**Erros Possíveis:**
- `400`: Email/senha incorretos ("Email/senha é obrigatório")
- `400`: Dados inválidos (validação Zod)

---

### 3. Detalhes do Usuário Autenticado

**Endpoint:** `GET /me`

**Autenticação:** ✅ JWT obrigatório (Bearer token)  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `DetailUserController`  
**Service:** `DetailUserService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros:** Nenhum

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `404`: Usuário não encontrado

---

## 📂 Categoria (Category)

### 4. Criar Categoria

**Endpoint:** `POST /category`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Apenas ADMIN  
**Controller:** `CreateCategoryController`  
**Service:** `CreateCategoryService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Corpo da Requisição (JSON):**
```json
{
  "name": "Pizzas Salgadas"
}
```

**Validações:**
- `name`: string, mínimo 2 caracteres

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-da-categoria",
  "name": "Pizzas Salgadas",
  "createAt": "2026-05-19T10:30:00.000Z",
  "updateAt": "2026-05-19T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `401`: Usuário não é ADMIN
- `400`: Dados inválidos (validação Zod)

---

### 5. Listar Categorias

**Endpoint:** `GET /category`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `ListCategoryController`  
**Service:** `ListCategoryService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros:** Nenhum

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid-categoria-1",
    "name": "Pizzas Salgadas",
    "createAt": "2026-05-19T10:30:00.000Z",
    "updateAt": "2026-05-19T10:30:00.000Z"
  },
  {
    "id": "uuid-categoria-2",
    "name": "Pizzas Doces",
    "createAt": "2026-05-19T10:35:00.000Z",
    "updateAt": "2026-05-19T10:35:00.000Z"
  }
]
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido

---

## 🍕 Produtos (Product)

### 6. Criar Produto

**Endpoint:** `POST /product`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Apenas ADMIN  
**Controller:** `CreateProductController`  
**Service:** `CreateProductService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
Content-Type: multipart/form-data
```

**Corpo da Requisição (Form Data):**
- `name`: string obrigatória (nome do produto)
- `price`: string numérica obrigatória (preço em centavos)
- `description`: string obrigatória
- `category_id`: string obrigatória (UUID da categoria)
- `file`: arquivo de imagem obrigatório (imagem do produto)

**Exemplo:**
```
name: "Pizza Margherita"
price: "3500"
description: "Pizza clássica com molho, queijo e tomate"
category_id: "uuid-categoria-1"
file: [arquivo de imagem]
```

**Validações:**
- `name`: mínimo 1 caractere
- `price`: apenas dígitos
- `description`: mínimo 1 caractere
- `category_id`: deve existir no banco de dados
- `file`: obrigatório

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-do-produto",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Pizza clássica com molho, queijo e tomate",
  "banner": "https://res.cloudinary.com/...",
  "category_id": "uuid-categoria-1",
  "disabled": false,
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `401`: Usuário não é ADMIN
- `400`: Arquivo de imagem não fornecido
- `400`: Categoria não encontrada
- `400`: Dados inválidos (validação Zod)
- `400`: Erro ao fazer upload da imagem

---

### 7. Listar Produtos

**Endpoint:** `GET /products`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `ListProductController`  
**Service:** `ListProductService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros de Query:**
- `disable` (opcional): "true" ou "false" - filtrar por status de desabilitação

**Exemplo de URLs:**
```
GET /products
GET /products?disable=false
GET /products?disable=true
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid-produto-1",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza clássica com molho, queijo e tomate",
    "banner": "https://res.cloudinary.com/...",
    "disabled": false,
    "category_id": "uuid-categoria-1",
    "createAt": "2026-05-19T10:30:00.000Z",
    "category": {
      "id": "uuid-categoria-1",
      "name": "Pizzas Salgadas"
    }
  }
]
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `400`: Dados inválidos (validação Zod)

---

### 8. Listar Produtos por Categoria

**Endpoint:** `GET /category/product/`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `ListProductByCategoryController`  
**Service:** `ListProductByCategoryService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros de Query:**
- `category_id` (obrigatório): UUID da categoria

**Exemplo de URL:**
```
GET /category/product/?category_id=uuid-categoria-1
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid-produto-1",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Pizza clássica com molho, queijo e tomate",
    "banner": "https://res.cloudinary.com/...",
    "disabled": false,
    "category_id": "uuid-categoria-1",
    "createAt": "2026-05-19T10:30:00.000Z",
    "category": {
      "id": "uuid-categoria-1",
      "name": "Pizzas Salgadas"
    }
  }
]
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `400`: `category_id` não fornecido (validação Zod)

---

### 9. Deletar Produto

**Endpoint:** `DELETE /product`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Apenas ADMIN  
**Controller:** `DeleteProductController`  
**Service:** `DeleteProductService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros de Query:**
- `product_id` (obrigatório): UUID do produto a deletar

**Exemplo de URL:**
```
DELETE /product?product_id=uuid-produto-1
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-produto-1",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Pizza clássica com molho, queijo e tomate",
  "banner": "https://res.cloudinary.com/...",
  "disabled": false,
  "category_id": "uuid-categoria-1",
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `401`: Usuário não é ADMIN
- `400`: Produto não encontrado

---

## 📦 Pedidos (Order)

### 10. Criar Pedido

**Endpoint:** `POST /order`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `CreateOrderController`  
**Service:** `CreateOrderService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Corpo da Requisição (JSON):**
```json
{
  "table": 5,
  "name": "João"
}
```

**Validações:**
- `table`: número inteiro obrigatório
- `name`: string opcional

**Resposta de Sucesso (201):**
```json
{
  "id": "uuid-do-pedido",
  "table": 5,
  "name": "João",
  "draft": true,
  "status": false,
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**Estados do Pedido:**
- `draft: true` = Pedido em rascunho (ainda pode adicionar itens)
- `status: false` = Pedido não finalizado
- `status: true` = Pedido finalizado

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `400`: Dados inválidos (validação Zod)

---

### 11. Listar Pedidos

**Endpoint:** `GET /orders`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `ListOrderController`  
**Service:** `ListOrderService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros:** Nenhum

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid-pedido-1",
    "table": 5,
    "name": "João",
    "draft": false,
    "status": false,
    "createAt": "2026-05-19T10:30:00.000Z",
    "items": [
      {
        "id": "uuid-item-1",
        "amount": 2,
        "product_id": "uuid-produto-1",
        "product": {
          "id": "uuid-produto-1",
          "name": "Pizza Margherita",
          "price": 3500
        }
      }
    ]
  }
]
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido

---

### 12. Adicionar Item ao Pedido

**Endpoint:** `POST /order/add`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `AddItemOrderController`  
**Service:** `AddItemOrderService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Corpo da Requisição (JSON):**
```json
{
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "amount": 2
}
```

**Validações:**
- `order_id`: string obrigatória (UUID válido)
- `product_id`: string obrigatória (UUID válido)
- `amount`: número inteiro positivo obrigatório

**Resposta de Sucesso (201):**
```json
{
  "id": "uuid-item",
  "amount": 2,
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `400`: Pedido não encontrado
- `400`: Produto não encontrado
- `400`: Dados inválidos (validação Zod)

---

### 13. Remover Item do Pedido

**Endpoint:** `DELETE /order/remove`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `RemoveItemOrderController`  
**Service:** `RemoveItemOrderService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros de Query:**
- `item_id` (obrigatório): UUID do item a remover

**Exemplo de URL:**
```
DELETE /order/remove?item_id=uuid-item-1
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-item",
  "amount": 2,
  "order_id": "uuid-do-pedido",
  "product_id": "uuid-do-produto",
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `400`: Item não encontrado
- `400`: `item_id` não fornecido (validação Zod)

---

### 14. Obter Detalhes do Pedido

**Endpoint:** `GET /order/detail`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `DetailOrderController`  
**Service:** `DetailOrderService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros de Query:**
- `order_id` (obrigatório): UUID do pedido

**Exemplo de URL:**
```
GET /order/detail?order_id=uuid-pedido-1
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-pedido-1",
  "table": 5,
  "name": "João",
  "draft": false,
  "status": false,
  "createAt": "2026-05-19T10:30:00.000Z",
  "items": [
    {
      "id": "uuid-item-1",
      "amount": 2,
      "product_id": "uuid-produto-1",
      "product": {
        "id": "uuid-produto-1",
        "name": "Pizza Margherita",
        "price": 3500,
        "banner": "https://res.cloudinary.com/..."
      }
    }
  ]
}
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `400`: Pedido não encontrado
- `400`: `order_id` não fornecido (validação Zod)

---

### 15. Enviar Pedido para Cozinha

**Endpoint:** `PUT /order/send`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `SendOrderController`  
**Service:** `SendOrderService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Corpo da Requisição (JSON):**
```json
{
  "order_id": "uuid-do-pedido",
  "name": "João Silva"
}
```

**Validações:**
- `order_id`: string obrigatória (UUID válido)
- `name`: string obrigatória

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-pedido-1",
  "table": 5,
  "name": "João Silva",
  "draft": false,
  "status": false,
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**O que acontece:**
- O pedido muda de `draft: true` para `draft: false`
- O pedido é enviado para a cozinha
- Não permite mais adicionar/remover itens

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `400`: Pedido não encontrado
- `400`: Dados inválidos (validação Zod)

---

### 16. Finalizar Pedido

**Endpoint:** `PUT /order/finish`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `FinishOrderController`  
**Service:** `FinishOrderService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Corpo da Requisição (JSON):**
```json
{
  "order_id": "uuid-do-pedido"
}
```

**Validações:**
- `order_id`: string obrigatória (UUID válido)

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-pedido-1",
  "table": 5,
  "name": "João Silva",
  "draft": false,
  "status": true,
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**O que acontece:**
- O pedido muda de `status: false` para `status: true`
- O pedido foi preparado na cozinha e está pronto

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `400`: Pedido não encontrado
- `400`: Dados inválidos (validação Zod)

---

### 17. Deletar Pedido

**Endpoint:** `DELETE /order`

**Autenticação:** ✅ JWT obrigatório  
**Autorização:** ✅ Qualquer usuário autenticado  
**Controller:** `DeleteOrderController`  
**Service:** `DeleteOrderService`  

**Cabeçalho:**
```
Authorization: Bearer <seu_token_jwt>
```

**Parâmetros de Query:**
- `order_id` (obrigatório): UUID do pedido a deletar

**Exemplo de URL:**
```
DELETE /order?order_id=uuid-pedido-1
```

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-pedido-1",
  "table": 5,
  "name": "João Silva",
  "draft": false,
  "status": false,
  "createAt": "2026-05-19T10:30:00.000Z"
}
```

**Erros Possíveis:**
- `401`: Token ausente ou inválido
- `400`: Pedido não encontrado
- `400`: `order_id` não fornecido (validação Zod)

---

## 🔐 Segurança e Autenticação

### JWT Token

- **Tipo:** Bearer Token
- **Duração:** 30 dias
- **Algoritmo:** HS256
- **Localização:** Header `Authorization: Bearer <token>`
- **Payload:** `{ name, email, sub (user_id) }`

### Níveis de Autorização

| Operação | Requer Autenticação | Requer Admin | Descrição |
|----------|-------------------|--------------|-----------|
| Criar usuário | ❌ | ❌ | Qualquer pessoa pode se registrar |
| Autenticar | ❌ | ❌ | Qualquer pessoa pode fazer login |
| Ver próprio perfil | ✅ | ❌ | Apenas usuários autenticados |
| Criar categoria | ✅ | ✅ | Apenas administradores |
| Listar categorias | ✅ | ❌ | Todos autenticados |
| Criar produto | ✅ | ✅ | Apenas administradores |
| Listar produtos | ✅ | ❌ | Todos autenticados |
| Deletar produto | ✅ | ✅ | Apenas administradores |
| Criar pedido | ✅ | ❌ | Todos autenticados |
| Gerenciar pedidos | ✅ | ❌ | Todos autenticados |

---

## 📝 Notas Importantes

1. **UUID:** Todos os IDs são strings UUID (v4)
2. **Timestamps:** Todas as datas estão em formato ISO 8601
3. **Preços:** Armazenados em centavos (1 real = 100 centavos)
4. **Status HTTP:** Segue o padrão REST (200, 201, 400, 401, 404, 500)
5. **Erros:** Retornam mensagens descritivas em caso de falha
6. **Token:** O token JWT deve ser incluído em todas as requisições autenticadas

---

**Última atualização:** 19 de maio de 2026
