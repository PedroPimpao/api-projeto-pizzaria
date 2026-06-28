# API Documentation - Sistema de Pizzaria

## Índice

1. [Autenticação](#autenticação)
2. [Usuários](#usuários)
3. [Sessão e Conta](#sessão-e-conta)
4. [Categorias](#categorias)
5. [Produtos](#produtos)
6. [Pedidos (Orders)](#pedidos-orders)
7. [Tabela Resumo](#tabela-resumo)

---

## Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Após fazer login, você receberá um token que deve ser incluído nas requisições protegidas.

### Como usar o Token

```http
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

### Roles disponíveis

```text
EXTERNAL
STAFF
ADMIN
SUPER_ADMIN
USER_ROOT
```

Observações:

- Usuários novos são criados com role padrão `EXTERNAL`.
- Rotas de pedidos bloqueiam usuários `EXTERNAL`.
- Rotas administrativas de categorias e produtos aceitam `ADMIN`, `SUPER_ADMIN` e `USER_ROOT`.
- Alteração de cargos aceita apenas usuários `SUPER_ADMIN` ou `USER_ROOT`.

---

## Usuários

### 1. Listar Usuários

Lista todos os usuários cadastrados.

**Endpoint:** `GET /users`

**Autenticação:** Não requerida na rota atual

**Permissão:** Pública na rota atual

**Headers:**

```http
Content-Type: application/json
```

**Resposta de Sucesso (200):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "EXTERNAL",
    "createdAt": "2026-06-28T10:30:00.000Z",
    "updatedAt": "2026-06-28T10:30:00.000Z"
  }
]
```

**Observações:**

- A senha não é retornada.
- A rota atual não usa `isAuthenticated`.

---

### 2. Criar Usuário

Cria um novo usuário no sistema.

**Endpoint:** `POST /users`

**Autenticação:** Não requerida

**Permissão:** Pública

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**

- `name`: mínimo 3 caracteres (obrigatório)
- `email`: email válido (obrigatório)
- `password`: mínimo 6 caracteres (obrigatório)

**Resposta de Sucesso (201):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "EXTERNAL",
    "createdAt": "2026-06-28T10:30:00.000Z",
    "updatedAt": "2026-06-28T10:30:00.000Z"
  }
}
```

**Respostas de Erro:**

```json
// 400 - Usuário já existe
{
  "error": "Usuário já existe"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no mínimo 3 caracteres" },
    { "message": "Precisa ser um email valido" }
  ]
}
```

**Observações:**

- Senha é criptografada com bcrypt.
- Role padrão é `EXTERNAL`.
- Senha não é retornada na resposta.

---

### 3. Atualizar Cargo do Usuário

Atualiza a role de um usuário.

**Endpoint:** `PATCH /user/role`

**Autenticação:** Requerida

**Permissão:** `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "role": "STAFF"
}
```

**Resposta de Sucesso (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2026-06-28T10:30:00.000Z",
  "updatedAt": "2026-06-28T10:40:00.000Z"
}
```

**Respostas de Erro:**

```json
// 401 ou 403 - Acesso negado
{
  "error": "Acesso negado"
}

// 400 - Usuário não encontrado
{
  "error": "Erro: Usuário não encontrado"
}

// 400 - Cargo já aplicado
{
  "error": "Erro: O usuário já possui esse cargo"
}
```

**Observações:**

- O service impede mais de um usuário com role `SUPER_ADMIN`.
- O service impede mais de um usuário com role `USER_ROOT`.
- Esta rota não possui schema Zod aplicado em `routes.ts`.

---

## Sessão e Conta

### 1. Autenticar Usuário (Login)

Autentica um usuário e retorna um token JWT.

**Endpoint:** `POST /session`

**Autenticação:** Não requerida

**Permissão:** Pública

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**

- `email`: email válido (obrigatório)
- `password`: string não vazia (obrigatório)

**Resposta de Sucesso (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respostas de Erro:**

```json
// 400 - Credenciais inválidas
{
  "error": "Email ou senha inválido"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "Precisa ser um email valido" }
  ]
}
```

**Observações:**

- Token JWT contém `sub` com o ID do usuário.
- Token expira em 30 dias.

---

### 2. Detalhes do Usuário Autenticado

Retorna informações do usuário logado.

**Endpoint:** `POST /me`

**Autenticação:** Requerida

**Permissão:** Usuário autenticado

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta de Sucesso (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2026-06-28T10:30:00.000Z",
  "updatedAt": "2026-06-28T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 401 - Token inválido ou não fornecido
{
  "error": "Acesso negado"
}

// 400 - Usuário não encontrado
{
  "error": "Usuário não encontrado"
}
```

---

### 3. Redefinir Senha do Usuário Logado

Altera a senha do usuário autenticado usando a senha atual.

**Endpoint:** `PATCH /session/reset-password`

**Autenticação:** Requerida

**Permissão:** Usuário autenticado

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "current_password": "senhaAtual123",
  "new_password": "novaSenha123",
  "confirm_new_password": "novaSenha123"
}
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Senha redefinida com sucesso!"
}
```

**Respostas de Erro:**

```json
// 400 - Senha atual inválida
{
  "error": "Email ou senha inválido"
}

// 400 - Senhas não coincidem
{
  "error": "As senhas não coincidem"
}
```

**Observações:**

- Esta rota não possui schema Zod aplicado em `routes.ts`.
- O service compara a senha atual com bcrypt antes de redefinir.

---

### 4. Redefinir Email do Usuário Logado

Altera o email do usuário autenticado usando a senha atual.

**Endpoint:** `PATCH /session/reset-email`

**Autenticação:** Requerida

**Permissão:** Usuário autenticado

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "password": "senhaAtual123",
  "new_email": "novo-email@example.com"
}
```

**Resposta de Sucesso (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "novo-email@example.com",
  "role": "STAFF",
  "createdAt": "2026-06-28T10:30:00.000Z",
  "updatedAt": "2026-06-28T10:45:00.000Z"
}
```

**Respostas de Erro:**

```json
// 400 - Senha inválida
{
  "error": "Senha inválida"
}

// 400 - Email igual ao antigo
{
  "error": "O novo email é igual ao antigo"
}
```

**Observações:**

- Esta rota não possui schema Zod aplicado em `routes.ts`.

---

### 5. Atualizar Nome do Usuário Logado

Atualiza o nome do usuário autenticado.

**Endpoint:** `PATCH /session/update-username`

**Autenticação:** Requerida

**Permissão:** Usuário autenticado

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "new_name": "João Santos"
}
```

**Resposta de Sucesso (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Santos",
  "email": "joao@example.com",
  "role": "STAFF",
  "createdAt": "2026-06-28T10:30:00.000Z",
  "updatedAt": "2026-06-28T10:45:00.000Z"
}
```

**Respostas de Erro:**

```json
// 400 - Nome igual ao antigo
{
  "error": "O novo nome é igual ao antigo"
}
```

**Observações:**

- Esta rota não possui schema Zod aplicado em `routes.ts`.

---

### 6. Solicitar Redefinição de Senha por OTP

Gera um código OTP para redefinição de senha.

**Endpoint:** `PATCH /session/request-reset`

**Autenticação:** Não requerida

**Permissão:** Pública

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "email": "joao@example.com"
}
```

Também é aceito:

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Resposta de Sucesso (200):**

```json
{
  "OTP": "123456",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Respostas de Erro:**

```json
// 400 - Usuário não encontrado
{
  "error": "Usuário não encontrado"
}

// 400 - Erro ao solicitar
{
  "error": "Erro ao solicitar redefnição de senha"
}
```

**Observações:**

- O OTP expira em 15 minutos.
- O service salva `passwordResetOTP`, `passwordResetExpires` e define `isPasswordResetAuthorized` como `false`.
- O comportamento atual retorna o OTP diretamente na resposta.
- Esta rota não possui schema Zod aplicado em `routes.ts`.

---

### 7. Validar Código OTP

Valida o código OTP de redefinição de senha.

**Endpoint:** `PATCH /session/code-validation`

**Autenticação:** Não requerida

**Permissão:** Pública

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "otp_code": "123456"
}
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Código validado com sucesso!"
}
```

**Respostas de Erro:**

```json
// 400 - Código inválido
{
  "error": "Código OTP inválido"
}

// 400 - Código expirado
{
  "error": "Código expirado"
}
```

**Observações:**

- Se o OTP for válido, o usuário recebe `isPasswordResetAuthorized: true`.
- Após validação, OTP e expiração são limpos.
- Esta rota não possui schema Zod aplicado em `routes.ts`.

---

### 8. Redefinir Senha por Esquecimento

Redefine a senha após validação do OTP.

**Endpoint:** `PATCH /session/forgot-password`

**Autenticação:** Não requerida

**Permissão:** Pública

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "new_password": "novaSenha123",
  "confirm_new_password": "novaSenha123"
}
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Senha redefinida com sucesso!"
}
```

**Respostas de Erro:**

```json
// 400 - OTP ainda não validado
{
  "error": "Ação não autorizada"
}

// 400 - Senhas não coincidem
{
  "error": "As senhas não coincidem"
}
```

**Observações:**

- Exige `isPasswordResetAuthorized: true`.
- Após redefinir a senha, o service limpa autorização, OTP e expiração.
- Esta rota não possui schema Zod aplicado em `routes.ts`.

---

## Categorias

### 1. Listar Categorias

Lista todas as categorias cadastradas.

**Endpoint:** `GET /categories`

**Autenticação:** Requerida

**Permissão:** Usuário autenticado

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Resposta de Sucesso (200):**

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Pizzas Salgadas",
    "products": [],
    "createdAt": "2026-06-28T10:30:00.000Z",
    "updatedAt": "2026-06-28T10:30:00.000Z"
  }
]
```

**Observações:**

- Categorias são ordenadas por nome em ordem crescente.
- Retorna `products` junto com os dados da categoria.

---

### 2. Criar Categoria

Cria uma nova categoria de produtos.

**Endpoint:** `POST /category`

**Autenticação:** Requerida

**Permissão:** `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Pizzas Doces"
}
```

**Validações:**

- `name`: mínimo 2 caracteres (obrigatório)

**Resposta de Sucesso (201):**

```json
{
  "category": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Pizzas Doces",
    "products": [],
    "createdAt": "2026-06-28T10:30:00.000Z",
    "updatedAt": "2026-06-28T10:30:00.000Z"
  }
}
```

**Respostas de Erro:**

```json
// 400 - Categoria já existe
{
  "error": "Categoria já existe"
}

// 403 - Sem permissão
{
  "error": "Acesso negado"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no mínimo 2 caracteres" }
  ]
}
```

---

### 3. Buscar Categoria por ID

Busca uma categoria específica pelo ID.

**Endpoint:** `GET /category`

**Autenticação:** Requerida

**Permissão:** `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```text
categoryId: "660e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```http
GET /category?categoryId=660e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "category": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Pizzas Salgadas",
    "products": [],
    "createdAt": "2026-06-28T10:30:00.000Z",
    "updatedAt": "2026-06-28T10:30:00.000Z"
  }
}
```

**Respostas de Erro:**

```json
// 400 - Categoria não encontrada
{
  "error": "Erro ao buscar categoria: Error: Categoria não encontrada"
}
```

---

### 4. Renomear Categoria

Atualiza o nome de uma categoria.

**Endpoint:** `PATCH /category/rename`

**Autenticação:** Requerida

**Permissão:** `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "categoryId": "660e8400-e29b-41d4-a716-446655440001",
  "newCategoryName": "Pizzas Especiais"
}
```

**Validações:**

- `categoryId`: string não vazia (obrigatório)
- `newCategoryName`: mínimo 2 caracteres (obrigatório)

**Resposta de Sucesso (200):**

```json
{
  "category": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Pizzas Especiais",
    "createdAt": "2026-06-28T10:30:00.000Z",
    "updatedAt": "2026-06-28T10:45:00.000Z"
  }
}
```

**Respostas de Erro:**

```json
// 400 - Categoria não existe
{
  "error": "Categoria não existe"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O nome precisa ter no mínimo 2 caracteres" }
  ]
}
```

---

## Produtos

### 1. Criar Produto

Cria um novo produto com upload de imagem.

**Endpoint:** `POST /products`

**Autenticação:** Requerida

**Permissão:** `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: multipart/form-data
```

**Body (FormData):**

```text
name: "Pizza Margherita"
price: "3500"
description: "Molho de tomate, mussarela e manjericão"
category_id: "660e8400-e29b-41d4-a716-446655440001"
file: [arquivo de imagem]
```

**Validações:**

- `name`: mínimo 3 caracteres (obrigatório)
- `price`: string com apenas dígitos (obrigatório)
- `description`: mínimo 1 caractere (obrigatório)
- `category_id`: string não vazia (obrigatório)
- `file`: imagem obrigatória (JPEG, JPG ou PNG, máximo 4MB)

**Resposta de Sucesso (201):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Molho de tomate, mussarela e manjericão",
  "category_id": "660e8400-e29b-41d4-a716-446655440001",
  "banner": "https://res.cloudinary.com/seu-cloud/image/upload/v1699792800/products/1699792800-margherita.jpg",
  "createdAt": "2026-06-28T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 400 - Imagem não fornecida
{
  "error": "Imagem é obrigatória"
}

// 400 - Tipo inválido
{
  "error": "Tipo de arquivo inválido. Apenas JPEG, JPG e PNG são permitidos."
}

// 400 - Categoria não existe
{
  "error": "Categoria não existe"
}

// 400 - Erro no upload
{
  "error": "Erro ao fazer o upload da imagem!"
}
```

**Observações:**

- Preço é convertido para número no controller.
- Imagem é enviada para Cloudinary.
- O campo `disabled` existe no banco e inicia como `false`, mas não é selecionado na resposta de criação.

---

### 2. Listar Produtos

Lista produtos com filtro de status.

**Endpoint:** `GET /products`

**Autenticação:** Requerida

**Permissão:** Usuário autenticado

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```text
disabled: "true" | "false" (opcional, padrão: "false")
```

**Exemplos de Uso:**

```http
GET /products
GET /products?disabled=false
GET /products?disabled=true
```

**Resposta de Sucesso (200):**

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/margherita.jpg",
    "category_id": "660e8400-e29b-41d4-a716-446655440001",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzas Salgadas"
    }
  }
]
```

**Observações:**

- Produtos são ordenados por data de criação, mais recentes primeiro.
- O campo `disabled` é usado no filtro, mas não é selecionado na resposta atual.

---

### 3. Deletar/Desativar Produto

Desativa um produto (soft delete).

**Endpoint:** `DELETE /product`

**Autenticação:** Requerida

**Permissão:** `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```text
product_id: "770e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```http
DELETE /product?product_id=770e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Produto deletado/arquivado com sucesso"
}
```

**Respostas de Erro:**

```json
// 400 - Falha ao deletar
{
  "error": "Falha ao deletar o produto"
}
```

**Observações:**

- Produto não é removido do banco, apenas `disabled` é alterado para `true`.
- Esta rota não possui schema Zod aplicado em `routes.ts`.

---

### 4. Listar Produtos por Categoria

Lista produtos ativos de uma categoria específica.

**Endpoint:** `GET /category/products`

**Autenticação:** Requerida

**Permissão:** Usuário autenticado

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```text
category_id: "660e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```http
GET /category/products?category_id=660e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Pizza Margherita",
    "price": 3500,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/.../products/margherita.jpg",
    "category_id": "660e8400-e29b-41d4-a716-446655440001",
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzas Salgadas"
    }
  }
]
```

**Respostas de Erro:**

```json
// 400 - Erro ao listar
{
  "error": "Erro ao listar produtos por categoria"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O ID da categoria é obrigatório" }
  ]
}
```

**Observações:**

- Retorna apenas produtos com `disabled: false`.
- Produtos são ordenados por data de criação, mais recentes primeiro.

---

## Pedidos (Orders)

Todas as rotas de pedidos exigem autenticação e bloqueiam usuários com role `EXTERNAL`.

### 1. Criar Pedido

Cria um novo pedido inicialmente como rascunho.

**Endpoint:** `POST /order`

**Autenticação:** Requerida

**Permissão:** `STAFF`, `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "table": 5,
  "name": "Mesa do João"
}
```

**Validações:**

- `table`: número inteiro positivo (obrigatório)
- `name`: string (opcional)

**Resposta de Sucesso (201):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "table": 5,
  "status": false,
  "draft": true,
  "name": "Mesa do João",
  "createdAt": "2026-06-28T10:30:00.000Z",
  "updatedAt": "2026-06-28T10:30:00.000Z"
}
```

**Respostas de Erro:**

```json
// 400 - Falha ao criar
{
  "error": "Erro ao criar pedido"
}

// 401 - Usuário externo
{
  "error": "Acesso negado - Requer STAFF"
}
```

**Observações:**

- Pedido é criado com `draft: true`.
- Status inicial é `false`.
- Se `name` não for enviado, o service salva string vazia.

---

### 2. Listar Pedidos

Lista pedidos filtrando por rascunho e status.

**Endpoint:** `GET /orders`

**Autenticação:** Requerida

**Permissão:** `STAFF`, `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```text
draft: "true" | "false" (opcional, padrão efetivo: "false")
status: "true" | "false" (opcional, padrão efetivo: "false")
```

**Exemplos de Uso:**

```http
GET /orders
GET /orders?draft=false&status=false
GET /orders?draft=true&status=false
GET /orders?draft=false&status=true
```

**Resposta de Sucesso (200):**

```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440001",
    "table": 5,
    "name": "Mesa 5 - João",
    "draft": false,
    "status": false,
    "createdAt": "2026-06-28T10:30:00.000Z",
    "updatedAt": "2026-06-28T10:35:00.000Z",
    "items": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440001",
        "amount": 2,
        "product": {
          "id": "770e8400-e29b-41d4-a716-446655440001",
          "name": "Pizza Margherita",
          "price": 3500,
          "description": "Molho de tomate, mussarela e manjericão",
          "banner": "https://res.cloudinary.com/.../products/margherita.jpg"
        }
      }
    ]
  }
]
```

**Observações:**

- Quando `draft` ou `status` não são `"true"`, o service trata como `false`.
- Esta rota não possui schema Zod aplicado em `routes.ts`.

---

### 3. Adicionar Item ao Pedido

Adiciona um produto a um pedido existente.

**Endpoint:** `POST /order/add`

**Autenticação:** Requerida

**Permissão:** `STAFF`, `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "order_id": "880e8400-e29b-41d4-a716-446655440001",
  "product_id": "770e8400-e29b-41d4-a716-446655440001",
  "amount": 2
}
```

**Validações:**

- `order_id`: string não vazia (obrigatório)
- `product_id`: string não vazia (obrigatório)
- `amount`: número inteiro positivo (obrigatório)

**Resposta de Sucesso (201):**

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440001",
  "amount": 2,
  "order_id": "880e8400-e29b-41d4-a716-446655440001",
  "product_id": "770e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2026-06-28T10:35:00.000Z",
  "updatedAt": "2026-06-28T10:35:00.000Z",
  "product": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Pizza Margherita",
    "description": "Molho de tomate, mussarela e manjericão",
    "price": 3500,
    "category": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Pizzas Salgadas"
    },
    "banner": "https://res.cloudinary.com/.../products/margherita.jpg"
  }
}
```

**Respostas de Erro:**

```json
// 400 - Falha ao adicionar
{
  "error": "Erro ao adicionar item ao pedido"
}

// 400 - Validação falhou
{
  "error": "Erro validação",
  "details": [
    { "message": "O valor deve ser um número positivo" }
  ]
}
```

**Observações:**

- O service valida se o pedido existe.
- O service valida se o produto existe e está ativo (`disabled: false`).

---

### 4. Remover Item do Pedido

Remove um item específico de um pedido.

**Endpoint:** `DELETE /order/remove`

**Autenticação:** Requerida

**Permissão:** `STAFF`, `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```text
item_id: "990e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```http
DELETE /order/remove?item_id=990e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Item removido com sucesso!"
}
```

**Respostas de Erro:**

```json
// 400 - Falha ao remover
{
  "error": "Erro ao remover item do pedido"
}
```

---

### 5. Detalhes do Pedido

Busca informações completas de um pedido específico.

**Endpoint:** `GET /order/detail`

**Autenticação:** Requerida

**Permissão:** `STAFF`, `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```text
order_id: "880e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```http
GET /order/detail?order_id=880e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "table": 5,
  "name": "Mesa 5 - João",
  "status": false,
  "draft": false,
  "createdAt": "2026-06-28T10:30:00.000Z",
  "updatedAt": "2026-06-28T10:35:00.000Z",
  "items": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "amount": 2,
      "createdAt": "2026-06-28T10:35:00.000Z",
      "updatedAt": "2026-06-28T10:35:00.000Z",
      "product": {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "name": "Pizza Margherita",
        "price": 3500,
        "description": "Molho de tomate, mussarela e manjericão",
        "banner": "https://res.cloudinary.com/.../products/margherita.jpg"
      }
    }
  ]
}
```

**Respostas de Erro:**

```json
// 400 - Falha ao buscar
{
  "error": "Erro ao buscar detalhes do pedido"
}
```

---

### 6. Enviar Pedido

Envia o pedido para preparo, removendo o modo rascunho.

**Endpoint:** `PATCH /order/send`

**Autenticação:** Requerida

**Permissão:** `STAFF`, `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "order_id": "880e8400-e29b-41d4-a716-446655440001",
  "name": "Mesa 5 - João"
}
```

**Validações:**

- `order_id`: string não vazia (obrigatório)
- `name`: string (opcional no schema)

**Resposta de Sucesso (200):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "table": 5,
  "name": "Mesa 5 - João",
  "draft": false,
  "status": false,
  "createdAt": "2026-06-28T10:30:00.000Z",
  "updatedAt": "2026-06-28T10:40:00.000Z"
}
```

**Respostas de Erro:**

```json
// 400 - Falha ao enviar
{
  "error": "Erro ao enviar o pedido"
}
```

**Observações:**

- Altera `draft` para `false`.
- Atualiza o campo `name` com o valor enviado.

---

### 7. Finalizar Pedido

Marca um pedido como finalizado.

**Endpoint:** `PATCH /order/finish`

**Autenticação:** Requerida

**Permissão:** `STAFF`, `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

**Body:**

```json
{
  "order_id": "880e8400-e29b-41d4-a716-446655440001"
}
```

**Validações:**

- `order_id`: string não vazia (obrigatório)

**Resposta de Sucesso (200):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "table": 5,
  "name": "Mesa 5 - João",
  "draft": false,
  "status": true,
  "createdAt": "2026-06-28T10:30:00.000Z",
  "updatedAt": "2026-06-28T10:45:00.000Z"
}
```

**Respostas de Erro:**

```json
// 400 - Falha ao finalizar
{
  "error": "Erro ao finalizar o pedido"
}
```

**Observações:**

- Altera `status` para `true`.

---

### 8. Deletar Pedido

Deleta permanentemente um pedido e seus itens relacionados.

**Endpoint:** `DELETE /order`

**Autenticação:** Requerida

**Permissão:** `STAFF`, `ADMIN`, `SUPER_ADMIN` ou `USER_ROOT`

**Headers:**

```http
Authorization: Bearer SEU_TOKEN_JWT
```

**Query Parameters:**

```text
order_id: "880e8400-e29b-41d4-a716-446655440001"
```

**Exemplo de Uso:**

```http
DELETE /order?order_id=880e8400-e29b-41d4-a716-446655440001
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Pedido excluido com sucesso"
}
```

**Respostas de Erro:**

```json
// 400 - Falha ao excluir
{
  "error": "Erro ao excluir o pedido"
}
```

**Observações:**

- A exclusão é permanente.
- Os itens relacionados são removidos por cascade.

---

## Tabela Resumo

### Todos os Endpoints

| Método | Rota | Autenticação | Permissão | Descrição |
| --- | --- | --- | --- | --- |
| GET | /users | Não | Pública | Listar usuários |
| POST | /users | Não | Pública | Criar usuário |
| PATCH | /user/role | Sim | SUPER_ADMIN/USER_ROOT | Atualizar cargo |
| POST | /session | Não | Pública | Login |
| POST | /me | Sim | Autenticado | Detalhes do usuário logado |
| PATCH | /session/reset-password | Sim | Autenticado | Redefinir senha logado |
| PATCH | /session/reset-email | Sim | Autenticado | Redefinir email logado |
| PATCH | /session/update-username | Sim | Autenticado | Atualizar nome logado |
| PATCH | /session/request-reset | Não | Pública | Solicitar OTP de senha |
| PATCH | /session/code-validation | Não | Pública | Validar OTP |
| PATCH | /session/forgot-password | Não | Pública | Redefinir senha por OTP |
| GET | /categories | Sim | Autenticado | Listar categorias |
| POST | /category | Sim | ADMIN/SUPER_ADMIN/USER_ROOT | Criar categoria |
| GET | /category | Sim | ADMIN/SUPER_ADMIN/USER_ROOT | Buscar categoria por ID |
| PATCH | /category/rename | Sim | ADMIN/SUPER_ADMIN/USER_ROOT | Renomear categoria |
| POST | /products | Sim | ADMIN/SUPER_ADMIN/USER_ROOT | Criar produto com imagem |
| GET | /products | Sim | Autenticado | Listar produtos |
| DELETE | /product | Sim | ADMIN/SUPER_ADMIN/USER_ROOT | Desativar produto |
| GET | /category/products | Sim | Autenticado | Listar produtos por categoria |
| POST | /order | Sim | Não EXTERNAL | Criar pedido |
| GET | /orders | Sim | Não EXTERNAL | Listar pedidos |
| POST | /order/add | Sim | Não EXTERNAL | Adicionar item ao pedido |
| DELETE | /order/remove | Sim | Não EXTERNAL | Remover item do pedido |
| GET | /order/detail | Sim | Não EXTERNAL | Detalhes do pedido |
| PATCH | /order/send | Sim | Não EXTERNAL | Enviar pedido |
| PATCH | /order/finish | Sim | Não EXTERNAL | Finalizar pedido |
| DELETE | /order | Sim | Não EXTERNAL | Deletar pedido |

---

## Códigos de Status HTTP

| Código | Significado | Quando Usar |
| --- | --- | --- |
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado ou atualizado conforme controller atual |
| 400 | Bad Request | Erro de validação ou regra de negócio |
| 401 | Unauthorized | Token ausente/inválido ou bloqueio por perfil |
| 403 | Forbidden | Role autenticada sem permissão no `inAuthorizedRoles` |
| 500 | Internal Error | Erro interno do servidor |

---

## Observações Importantes

### Preços

- Produtos armazenam `price` como inteiro.
- O controller de criação recebe `price` como string no FormData e converte com `parseInt`.
- Exemplo comum: `3500` = R$ 35,00.

### IDs

- IDs são strings UUID geradas pelo Prisma.
- Formato: `550e8400-e29b-41d4-a716-446655440000`.

### Timestamps

- `createdAt`: data de criação.
- `updatedAt`: data de atualização.
- Formato: ISO 8601.

### Soft Delete

- Produtos usam `disabled`.
- `DELETE /product` marca `disabled: true`, sem remover fisicamente o produto.

### Status dos Pedidos

- `draft`: `true` = rascunho, `false` = enviado.
- `status`: `false` = em andamento, `true` = finalizado.

### Upload de Imagens

- Formatos aceitos: JPEG, JPG e PNG.
- Tamanho máximo: 4MB.
- Armazenamento: Cloudinary.
- Processamento: Multer com `memoryStorage`.

### Validação

- Rotas com `validateSchema` usam Zod e retornam `400` com `error: "Erro validação"`.
- Algumas rotas novas ainda não possuem schema Zod aplicado em `routes.ts`; nesses casos, a validação ocorre principalmente nos services ou pelo próprio banco.

---

**Documento atualizado em**: 28/06/2026  
**Versão da API**: 3.0.0  
**Última atualização**: documentação alinhada com `routes.ts`, controllers atuais, roles avançadas, endpoints de conta/OTP, categorias, produtos e pedidos.
