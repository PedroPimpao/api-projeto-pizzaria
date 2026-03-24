# Endpoints

## **🔓 Rotas Públicas**

- [ ]  POST /users - Criar usuário
- [ ]  POST /session - Login (autenticação)

## **🔒 Rotas Autenticadas**

### **👤 Usuários**

- [ ]  GET /me - Obter dados do usuário logado

### **📁 Categorias**

- [ ]  POST /category - Criar categoria **(requer ADMIN)**
- [ ]  GET /category - Listar todas as categorias

### **🍕 Produtos**

- [ ]  POST /product - Criar produto com imagem **(requer ADMIN)**
- [ ]  DELETE /product - Deletar produto **(requer ADMIN)**
- [ ]  GET /category/product - Listar produtos por categoria

### **📋 Pedidos**

- [ ]  POST /order - Criar pedido
- [ ]  POST /order/add - Adicionar item ao pedido
- [ ]  DELETE /order/remove - Remover item do pedido
- [ ]  GET /orders - Listar todos os pedidos (com filtro opcional por draft)
- [ ]  GET /order/detail - Obter detalhes de um pedido específico
- [ ]  PUT /order/send - Enviar pedido para produção
- [ ]  PUT /order/finish - Finalizar pedido
- [ ]  DELETE /order - Deletar pedido