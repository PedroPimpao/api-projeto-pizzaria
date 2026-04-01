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

const router = Router();

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

export { router };
