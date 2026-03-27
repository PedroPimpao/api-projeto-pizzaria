import { Router } from 'express';
import { CreateUserController } from './controllers/user/create-user-controller';
import { validateSchema } from './middlewares/validateSchema';
import { authUserSchema, createUserSchema } from './schemas/userSchema';
import { GetUsersController } from './controllers/user/get-users-controller';
import { AuthUserController } from './controllers/user/auth-user-controller';
import { DetailUserController } from './controllers/user/detail-user-controller';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { CreateCategoryController } from './controllers/category/create-category-controller';

const router = Router();

// Rotas users
router.get('/users', new GetUsersController().getAll);
router.post('/users', validateSchema(createUserSchema), new CreateUserController().handle);
router.post('/session', validateSchema(authUserSchema), new AuthUserController().handle)
router.post('/me',isAuthenticated , new DetailUserController().handle)

// Rotas category
router.post('/category', isAuthenticated, new CreateCategoryController().handle)

export { router };
