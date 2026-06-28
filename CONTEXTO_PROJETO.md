# Documentação de Contexto do Projeto - Sistema de Pizzaria

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias e Versões](#tecnologias-e-versões)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelagem do Banco de Dados](#modelagem-do-banco-de-dados)
6. [Middlewares](#middlewares)
7. [Upload de Arquivos](#upload-de-arquivos)
8. [Validação com Schemas](#validação-com-schemas)
9. [Endpoints](#endpoints)
10. [Fluxos Importantes](#fluxos-importantes)
11. [Configurações do Projeto](#configurações-do-projeto)
12. [Resumo de Controllers e Services](#resumo-de-controllers-e-services)

---

## Visão Geral

Backend de gerenciamento de pizzaria desenvolvido em Node.js com TypeScript, Express, Prisma ORM, PostgreSQL e Zod. O sistema cobre autenticação, controle de usuários e cargos, categorias, produtos com upload de imagem, pedidos e fluxo de redefinição de senha por código OTP.

---

## Arquitetura

O projeto segue o padrão **MVC + Service Layer**:

```text
Requisição HTTP -> Rotas -> Middlewares -> Controller -> Service -> Prisma/PostgreSQL -> Resposta HTTP
```

### Camadas

- **Rotas (`src/routes.ts`)**: definem endpoints e composição de middlewares.
- **Middlewares**: autenticação JWT, autorização por cargo, restrições por perfil e validação Zod.
- **Controllers**: extraem dados da requisição e delegam a execução para os services.
- **Services**: concentram regras de negócio e acesso ao banco.
- **Prisma Client (`src/lib/prisma.ts`)**: instancia o Prisma com adapter `@prisma/adapter-pg`.

### Convenções atuais

- Arquivos usam nomes em kebab/lowercase, por exemplo `create-user-controller.ts`.
- Controllers exportam classes com nomes em PascalCase, por exemplo `CreateUserController`.
- Services exportam classes com nomes em PascalCase, por exemplo `CreateUserService`.
- Schemas ficam centralizados em `src/schemas`.

---

## Tecnologias e Versões

### Dependências de Produção

| Tecnologia | Versão | Finalidade |
| --- | --- | --- |
| express | ^5.1.0 | Framework web |
| @prisma/client | ^7.5.0 | Prisma Client |
| @prisma/adapter-pg | ^7.5.0 | Adapter PostgreSQL para Prisma |
| prisma | ^7.5.0 | Prisma CLI e ORM |
| pg | ^8.20.0 | Driver PostgreSQL |
| zod | ^4.3.6 | Validação de schemas |
| bcryptjs | ^3.0.3 | Hash e comparação de senhas |
| jsonwebtoken | ^9.0.3 | JWT |
| cors | ^2.8.5 | CORS |
| dotenv | ^17.2.3 | Variáveis de ambiente |
| tsx | ^4.20.6 | Execução TypeScript em desenvolvimento |
| multer | ^2.1.1 | Upload de arquivos |
| cloudinary | ^2.9.0 | Armazenamento de imagens |

### Dependências de Desenvolvimento

| Tecnologia | Versão | Finalidade |
| --- | --- | --- |
| typescript | ^5.9.3 | Tipagem estática |
| prettier | ^3.8.1 | Formatação |
| @types/express | ^5.0.5 | Tipos do Express |
| @types/cors | ^2.8.19 | Tipos do CORS |
| @types/jsonwebtoken | ^9.0.10 | Tipos do JWT |
| @types/multer | ^2.1.0 | Tipos do Multer |
| @types/node | ^24.10.0 | Tipos do Node.js |

---

## Estrutura de Pastas

```text
pizzaria-api/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── @types/express/index.d.ts
│   ├── config/
│   │   ├── cloudinary.ts
│   │   └── multer.ts
│   ├── controllers/
│   │   ├── category/
│   │   ├── order/
│   │   ├── product/
│   │   └── user/
│   ├── lib/prisma.ts
│   ├── middlewares/
│   ├── public/
│   ├── schemas/
│   ├── services/
│   │   ├── category/
│   │   ├── order/
│   │   ├── product/
│   │   └── user/
│   ├── utils/
│   │   ├── generateOTPCode.ts
│   │   └── resetPassword.ts
│   ├── routes.ts
│   └── server.ts
├── CONTEXTO_PROJETO.md
├── endpoints.md
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## Modelagem do Banco de Dados

### Enum Role

```prisma
enum Role {
  EXTERNAL
  STAFF
  ADMIN
  SUPER_ADMIN
  USER_ROOT
}
```

### User

```typescript
{
  id: string;
  name: string;
  email: string; // unique
  password: string;
  role: "EXTERNAL" | "STAFF" | "ADMIN" | "SUPER_ADMIN" | "USER_ROOT"; // default EXTERNAL
  passwordResetOTP?: string | null;
  passwordResetExpires?: Date | null;
  isPasswordResetAuthorized: boolean; // default false
  createdAt: Date;
  updatedAt: Date;
}
```

### Category

```typescript
{
  id: string;
  name: string;
  products: Products[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Products

```typescript
{
  id: string;
  name: string;
  price: number; // inteiro, normalmente centavos
  description: string;
  banner: string;
  disabled: boolean;
  category_id: string;
  category: Category;
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Order

```typescript
{
  id: string;
  table: number;
  status: boolean; // false = aberto, true = finalizado
  draft: boolean; // true = rascunho, false = enviado
  name?: string | null;
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Item

```typescript
{
  id: string;
  amount: number;
  order_id: string;
  order: Order;
  product_id: string;
  product: Products;
  createdAt: Date;
  updatedAt: Date;
}
```

### Regras de relacionamento

- `Category -> Products`: uma categoria possui vários produtos.
- `Products -> Item`: um produto pode aparecer em vários itens.
- `Order -> Item`: um pedido possui vários itens.
- Deleção de `Category`, `Products` ou `Order` aplica cascade nas relações configuradas.

---

## Middlewares

### `isAuthenticated`

Valida o token JWT enviado no header `Authorization: Bearer <token>`. Quando válido, adiciona `req.user_id` com o `sub` do token.

### `inAuthorizedRoles(...roles)`

Middleware genérico para autorização por cargos. Busca o usuário autenticado e permite acesso apenas se `user.role` estiver entre os cargos informados.

Uso atual:

```typescript
inAuthorizedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER_ROOT)
```

### `isExternal`

Bloqueia usuários com role `EXTERNAL`. É usado nas rotas de pedidos, exigindo que o usuário seja pelo menos `STAFF`.

### Middlewares específicos de cargo

Também existem middlewares específicos:

- `isAdmin`: permite `ADMIN` e `SUPER_ADMIN`.
- `isStaff`: permite apenas `STAFF`.
- `isSuperAdmin`: permite `SUPER_ADMIN` e `USER_ROOT`.
- `isUserRoot`: permite apenas `USER_ROOT`.

Mesmo existindo, várias rotas atuais preferem `inAuthorizedRoles`.

### `validateSchema`

Recebe um schema Zod e valida `body`, `query` e/ou `params`. Em caso de erro, retorna `400` com detalhes da validação.

---

## Upload de Arquivos

O upload de imagens de produto usa `multer` com `memoryStorage()` e envio para Cloudinary.

### Multer (`src/config/multer.ts`)

- Arquivo esperado: `file`.
- Armazenamento em memória.
- Limite: 4MB.
- Tipos aceitos: `image/jpeg`, `image/jpg`, `image/png`.

### Cloudinary (`src/config/cloudinary.ts`)

O `CreateProductService` envia o buffer da imagem para o Cloudinary e salva a URL retornada no campo `banner`.

---

## Validação com Schemas

### User Schemas (`src/schemas/userSchema.ts`)

#### `createUserSchema`

Valida:

```typescript
{
  body: {
    name: string; // min 3
    email: string; // email válido
    password: string; // min 6
  }
}
```

#### `authUserSchema`

Valida:

```typescript
{
  body: {
    email: string; // email válido
    password: string; // obrigatório
  }
}
```

Observação: os endpoints de reset de senha, reset de email, atualização de nome, alteração de cargo e OTP ainda não possuem schemas Zod aplicados em `routes.ts`; a validação principal ocorre nos services.

### Category Schemas (`src/schemas/categorySchema.ts`)

#### `createCategorySchema`

```typescript
{
  body: {
    name: string; // min 2
  }
}
```

#### `getUniqueCategorySchema`

```typescript
{
  query: {
    categoryId: string;
  }
}
```

#### `updateCategoryNameSchema`

```typescript
{
  body: {
    categoryId: string;
    newCategoryName: string; // min 2
  }
}
```

### Product Schemas (`src/schemas/productSchema.ts`)

#### `createProductSchema`

```typescript
{
  body: {
    name: string; // min 3
    price: string; // apenas dígitos
    description: string;
    category_id: string;
  }
}
```

#### `listProductSchema`

```typescript
{
  query: {
    disabled?: "true" | "false"; // default "false", transformado em boolean
  }
}
```

#### `listProductByCategorySchema`

```typescript
{
  query: {
    category_id: string;
  }
}
```

### Order Schemas (`src/schemas/orderSchema.ts`)

- `createOrderSchema`: `body.table` inteiro positivo e `body.name` opcional.
- `addItemSchema`: `body.order_id`, `body.product_id`, `body.amount` inteiro positivo.
- `removeItemSchema`: `query.item_id`.
- `orderDetailSchema`: `query.order_id`.
- `sendOrderSchema`: `body.order_id` e `body.name` opcional.
- `finishOrderSchema`: `body.order_id`.
- `deleteOrderSchema`: `query.order_id`.

---

## Endpoints

### Usuários e Sessão

#### `GET /users`

Lista usuários.

- Controller: `GetUsersController`
- Service: `GetUsersService`
- Middlewares: nenhum na rota atual
- Resposta: usuários sem senha

#### `POST /users`

Cria usuário.

- Controller: `CreateUserController`
- Service: `CreateUserService`
- Middlewares: `validateSchema(createUserSchema)`
- Body: `name`, `email`, `password`
- Role padrão no banco: `EXTERNAL`

#### `POST /session`

Autentica usuário.

- Controller: `AuthUserController`
- Service: `AuthUserService`
- Middlewares: `validateSchema(authUserSchema)`
- Body: `email`, `password`
- Resposta: dados do usuário e token JWT

#### `POST /me`

Retorna dados do usuário autenticado.

- Controller: `DetailUserController`
- Service: `DetailUserService`
- Middlewares: `isAuthenticated`

#### `PATCH /user/role`

Atualiza o cargo de um usuário.

- Controller: `UpdateUserRoleController`
- Service: `UpdateUserRoleService`
- Middlewares: `isAuthenticated`, `inAuthorizedRoles(Role.SUPER_ADMIN, Role.USER_ROOT)`
- Body: `user_id`, `role`
- Regras: limita `SUPER_ADMIN` e `USER_ROOT` a no máximo um usuário cada.

#### `PATCH /session/reset-password`

Altera a senha do usuário autenticado mediante senha atual.

- Controller: `ResetUserPasswordController`
- Service: `ResetUserPasswordService`
- Middlewares: `isAuthenticated`
- Body: `user_id`, `current_password`, `new_password`, `confirm_new_password`

#### `PATCH /session/reset-email`

Altera o email do usuário autenticado mediante senha.

- Controller: `ResetUserEmailController`
- Service: `ResetUserEmailService`
- Middlewares: `isAuthenticated`
- Body: `user_id`, `password`, `new_email`

#### `PATCH /session/update-username`

Atualiza o nome do usuário autenticado.

- Controller: `UpdateUsernameController`
- Service: `UpdateUsernameService`
- Middlewares: `isAuthenticated`
- Body: `user_id`, `new_name`

#### `PATCH /session/request-reset`

Solicita redefinição de senha e gera OTP.

- Controller: `RequestPasswordResetController`
- Service: `RequestPasswordResetService`
- Middlewares: nenhum na rota atual
- Body: `user_id` e/ou `email`
- Resposta atual: `OTP` e `userId`
- Regra: OTP expira em 15 minutos e `isPasswordResetAuthorized` volta para `false`.

#### `PATCH /session/code-validation`

Valida o código OTP.

- Controller: `CheckOtpCodeController`
- Service: `CheckOtpCodeService`
- Middlewares: nenhum na rota atual
- Body: `user_id`, `otp_code`
- Regra: se válido e não expirado, marca `isPasswordResetAuthorized` como `true` e limpa OTP/expiração.

#### `PATCH /session/forgot-password`

Redefine senha após OTP validado.

- Controller: `ForgotPasswordController`
- Service: `ForgotPasswordService`
- Middlewares: nenhum na rota atual
- Body: `user_id`, `new_password`, `confirm_new_password`
- Regra: exige `isPasswordResetAuthorized = true`; depois redefine a senha e limpa autorização/OTP.

### Categorias

#### `GET /categories`

Lista categorias.

- Controller: `GetCategoriesController`
- Service: `GetCategoriesService`
- Middlewares: `isAuthenticated`

#### `POST /category`

Cria categoria.

- Controller: `CreateCategoryController`
- Service: `CreateCategoryService`
- Middlewares: `isAuthenticated`, `inAuthorizedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER_ROOT)`, `validateSchema(createCategorySchema)`
- Body: `name`

#### `GET /category`

Busca uma categoria por ID.

- Controller: `GetUniqueCatgoryController`
- Service: `GetUniqueCatgoryService`
- Middlewares: `isAuthenticated`, `inAuthorizedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER_ROOT)`, `validateSchema(getUniqueCategorySchema)`
- Query: `categoryId`
- Resposta: categoria com produtos

#### `PATCH /category/rename`

Renomeia uma categoria.

- Controller: `RenameCategoryController`
- Service: `RenameCategoryService`
- Middlewares: `isAuthenticated`, `inAuthorizedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER_ROOT)`, `validateSchema(updateCategoryNameSchema)`
- Body: `categoryId`, `newCategoryName`

### Produtos

#### `POST /products`

Cria produto com upload de imagem.

- Controller: `CreateProductController`
- Service: `CreateProductService`
- Middlewares: `isAuthenticated`, `inAuthorizedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER_ROOT)`, `upload.single("file")`, `validateSchema(createProductSchema)`
- Body multipart: `name`, `price`, `description`, `category_id`, `file`

#### `GET /products`

Lista produtos filtrando por status `disabled`.

- Controller: `ListProductController`
- Service: `ListProductService`
- Middlewares: `isAuthenticated`, `validateSchema(listProductSchema)`
- Query: `disabled=true|false` opcional, padrão `false`

#### `DELETE /product`

Desativa produto.

- Controller: `DeleteProductController`
- Service: `DeleteProductService`
- Middlewares: `isAuthenticated`, `inAuthorizedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER_ROOT)`
- Query esperada pelo controller/service: `product_id`
- Regra: produto é marcado como `disabled`, não removido fisicamente.

#### `GET /category/products`

Lista produtos por categoria.

- Controller: `ListProductByCategoryController`
- Service: `ListProductByCategoryService`
- Middlewares: `isAuthenticated`, `validateSchema(listProductByCategorySchema)`
- Query: `category_id`

### Pedidos

Todas as rotas de pedidos exigem `isAuthenticated` e `isExternal`, ou seja, bloqueiam usuários `EXTERNAL`.

#### `POST /order`

Cria pedido em rascunho.

- Controller: `CreateOrderController`
- Service: `CreateOrderService`
- Middlewares: `isAuthenticated`, `isExternal`, `validateSchema(createOrderSchema)`
- Body: `table`, `name?`

#### `GET /orders`

Lista pedidos.

- Controller: `ListOrdersController`
- Service: `ListOrdersService`
- Middlewares: `isAuthenticated`, `isExternal`
- Query: `draft=true|false` e `status=true|false` opcionais
- Observação: quando ausentes, o service filtra `draft=false` e `status=false`.

#### `POST /order/add`

Adiciona item ao pedido.

- Controller: `AddItemOrderController`
- Service: `AddItemOrderService`
- Middlewares: `isAuthenticated`, `isExternal`, `validateSchema(addItemSchema)`
- Body: `order_id`, `product_id`, `amount`

#### `DELETE /order/remove`

Remove item de um pedido.

- Controller: `RemoveItemOrderController`
- Service: `RemoveItemOrderService`
- Middlewares: `isAuthenticated`, `isExternal`, `validateSchema(removeItemSchema)`
- Query: `item_id`

#### `GET /order/detail`

Busca detalhes de um pedido.

- Controller: `GetOrderDetailController`
- Service: `GetOrderDetailService`
- Middlewares: `isAuthenticated`, `isExternal`, `validateSchema(orderDetailSchema)`
- Query: `order_id`

#### `PATCH /order/send`

Envia pedido para preparo, removendo o modo rascunho.

- Controller: `SendOrderController`
- Service: `SendOrderService`
- Middlewares: `isAuthenticated`, `isExternal`, `validateSchema(sendOrderSchema)`
- Body: `order_id`, `name?`

#### `PATCH /order/finish`

Finaliza pedido.

- Controller: `FinishOrderController`
- Service: `FinishOrderService`
- Middlewares: `isAuthenticated`, `isExternal`, `validateSchema(finishOrderSchema)`
- Body: `order_id`

#### `DELETE /order`

Exclui pedido.

- Controller: `DeleteOrderController`
- Service: `DeleteOrderService`
- Middlewares: `isAuthenticated`, `isExternal`, `validateSchema(deleteOrderSchema)`
- Query: `order_id`

---

## Fluxos Importantes

### Criação e autenticação de usuário

1. `POST /users` valida `name`, `email` e `password`.
2. `CreateUserService` verifica duplicidade de email, criptografa a senha e cria o usuário.
3. O role padrão é `EXTERNAL`.
4. `POST /session` valida credenciais, compara senha com bcrypt e retorna token JWT.

### Autorização por cargo

1. `isAuthenticated` valida o token e injeta `req.user_id`.
2. `inAuthorizedRoles` busca o usuário no banco.
3. A rota continua somente se o role estiver na lista permitida.

### Recuperação de senha por OTP

1. `PATCH /session/request-reset` recebe `email` ou `user_id`, gera OTP e expiração de 15 minutos.
2. `PATCH /session/code-validation` valida OTP e expiração, autorizando a troca de senha.
3. `PATCH /session/forgot-password` troca a senha se `isPasswordResetAuthorized` estiver `true`.
4. Após redefinir, o service limpa autorização, OTP e expiração.

### Produto com upload

1. `POST /products` exige usuário autenticado e cargo administrativo.
2. `multer` valida tipo e tamanho do arquivo.
3. `createProductSchema` valida campos textuais.
4. `CreateProductService` envia a imagem para Cloudinary e salva a URL no banco.

---

## Configurações do Projeto

### Prisma

Arquivo: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
```

O client é instanciado em `src/lib/prisma.ts` com `PrismaPg`:

```typescript
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });
```

### Express Server

Arquivo: `src/server.ts`

- Usa `express.json()`.
- Usa `cors()`.
- Registra `router`.
- Possui error handler global.
- Porta padrão: `3333`, com suporte a `process.env.PORT`.
- Endpoint raiz: `GET /` retorna `{ message: "API Pizzaria" }`.

### Scripts NPM

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

### Variáveis de ambiente

Principais variáveis usadas:

```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="sua-chave-secreta"
PORT=3333
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

---

## Resumo de Controllers e Services

### User

Controllers:

- `CreateUserController`
- `GetUsersController`
- `AuthUserController`
- `DetailUserController`
- `UpdateUserRoleController`
- `ResetUserPasswordController`
- `ResetUserEmailController`
- `UpdateUsernameController`
- `RequestPasswordResetController`
- `CheckOtpCodeController`
- `ForgotPasswordController`

Services:

- `CreateUserService`
- `GetUsersService`
- `AuthUserService`
- `DetailUserService`
- `UpdateUserRoleService`
- `ResetUserPasswordService`
- `ResetUserEmailService`
- `UpdateUsernameService`
- `RequestPasswordResetService`
- `CheckOtpCodeService`
- `ForgotPasswordService`

### Category

Controllers:

- `CreateCategoryController`
- `GetCategoriesController`
- `GetUniqueCatgoryController`
- `RenameCategoryController`

Services:

- `CreateCategoryService`
- `GetCategoriesService`
- `GetUniqueCatgoryService`
- `RenameCategoryService`

### Product

Controllers:

- `CreateProductController`
- `ListProductController`
- `DeleteProductController`
- `ListProductByCategoryController`

Services:

- `CreateProductService`
- `ListProductService`
- `DeleteProductService`
- `ListProductByCategoryService`

### Order

Controllers:

- `CreateOrderController`
- `AddItemOrderController`
- `RemoveItemOrderController`
- `GetOrderDetailController`
- `SendOrderController`
- `FinishOrderController`
- `ListOrdersController`
- `DeleteOrderController`

Services:

- `CreateOrderService`
- `AddItemOrderService`
- `RemoveItemOrderService`
- `GetOrderDetailService`
- `SendOrderService`
- `FinishOrderService`
- `ListOrdersService`
- `DeleteOrderService`

---

## Observações Importantes

1. Usuários novos começam com role `EXTERNAL`.
2. Rotas de pedido usam `isExternal` para bloquear usuários externos.
3. Rotas administrativas de categoria/produto usam `inAuthorizedRoles(Role.ADMIN, Role.SUPER_ADMIN, Role.USER_ROOT)`.
4. Alteração de cargo é restrita a `SUPER_ADMIN` e `USER_ROOT`.
5. O fluxo de recuperação de senha retorna o OTP na resposta atual da API; em produção, o ideal seria enviar por email/SMS e não expor o código diretamente.
6. Algumas rotas novas ainda não têm schemas Zod dedicados em `routes.ts`.
7. `DeleteProductService` faz soft delete marcando `disabled`.
8. Uploads de produto ficam no Cloudinary; arquivos não são persistidos localmente.

---

**Documento atualizado em**: 28/06/2026  
**Versão do Projeto**: 3.0.0  
**Última atualização**: contexto alinhado com roles avançadas, middlewares atuais, endpoints de usuário/sessão, OTP, categorias, produtos, pedidos, Prisma 7 e estrutura real do projeto.
