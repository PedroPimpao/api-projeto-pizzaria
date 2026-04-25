import { Router } from 'express';
import { CreateUserController } from './controllers/user/create-user-controller';
import { validateSchema } from './middlewares/validateSchema';
import { authUserSchema, createUserSchema } from './schemas/userSchema';
import { createCategorySchema } from './schemas/categorySchema';
import { GetUsersController } from './controllers/user/get-users-controller';
import { AuthUserController } from './controllers/user/auth-user-controller';
import { DetailUserController } from './controllers/user/detail-user-controller';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { CreateCategoryController } from './controllers/category/create-category-controller';
import { GetCategoriesController } from './controllers/category/get-categories-controller';
import { isAdmin } from './middlewares/isAdmin';
import { CreateProductController } from './controllers/product/create-product-controller';
import multer from 'multer';
import uploadConfig from './config/multer';
import {
  createProductSchema,
  listProductByCategorySchema,
  listProductSchema,
} from './schemas/productSchema';
import { ListProductController } from './controllers/product/list-product-controller';
import { DeleteProductController } from './controllers/product/delete-product-controller';
import { ListProductByCategoryController } from './controllers/product/list-product-cetegory-controller';
import { ListOrdersController } from './controllers/order/list-orders-controller';
import { CreateOrderController } from './controllers/order/create-order-controller';
import {
  addItemSchema,
  createOrderSchema,
  deleteOrderSchema,
  finishOrderSchema,
  orderDetailSchema,
  removeItemSchema,
  sendOrderSchema,
} from './schemas/orderSchema';
import { AddItemOrderController } from './controllers/order/add-item-order-controller';
import { RemoveItemOrderController } from './controllers/order/remove-item-order-controller';
import { GetOrderDetailController } from './controllers/order/get-order-detail-controller';
import { SendOrderController } from './controllers/order/send-order-controller';
import { FinishOrderController } from './controllers/order/finish-order-controller';
import { DeleteOrderController } from './controllers/order/delete-order-controller';

export const router = Router();
const upload = multer(uploadConfig);

// Rotas users
router.get('/users', new GetUsersController().getAll);
router.post('/users', validateSchema(createUserSchema), new CreateUserController().handle);
router.post('/session', validateSchema(authUserSchema), new AuthUserController().handle);
router.post('/me', isAuthenticated, new DetailUserController().handle);

// Rotas category
router.get('/category', isAuthenticated, new GetCategoriesController().getAll);

router.post(
  '/category',
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);

// Rotas product

router.post(
  '/products',
  isAuthenticated,
  isAdmin,
  upload.single('file'),
  validateSchema(createProductSchema),
  new CreateProductController().handle,
);

router.get(
  '/products',
  isAuthenticated,
  validateSchema(listProductSchema),
  new ListProductController().handle,
);

router.delete(
  '/product',
  isAuthenticated,
  isAdmin,
  new DeleteProductController().handle,
);

router.get(
  '/category/products',
  isAuthenticated,
  validateSchema(listProductByCategorySchema),
  new ListProductByCategoryController().handle,
);

// Rotas order
router.post(
  '/order',
  isAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle,
);

router.get('/orders', isAuthenticated, new ListOrdersController().handle);

// Adicionar item a order
router.post(
  '/order/add',
  isAuthenticated,
  validateSchema(addItemSchema),
  new AddItemOrderController().handle,
);

// Remover item da order
router.delete(
  '/order/remove',
  isAuthenticated,
  validateSchema(removeItemSchema),
  new RemoveItemOrderController().handle,
);

// Buscar detalhes do pedido
router.get(
  '/order/detail',
  isAuthenticated,
  validateSchema(orderDetailSchema),
  new GetOrderDetailController().handle,
);

// Enviar pedido
router.patch(
  '/order/send',
  isAuthenticated,
  validateSchema(sendOrderSchema),
  new SendOrderController().handle,
);

// Finalizar pedido
router.patch(
  '/order/finish',
  isAuthenticated,
  validateSchema(finishOrderSchema),
  new FinishOrderController().handle,
);

// Excluir pedido
router.delete(
  '/order',
  isAuthenticated,
  validateSchema(deleteOrderSchema),
  new DeleteOrderController().handle,
);
