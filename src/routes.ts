import { Router } from 'express';
import { CreateUserController } from './controllers/user/create-user-controller';
import { validateSchema } from './middlewares/validateSchema';
import { authUserSchema, createUserSchema } from './schemas/userSchema';
import { GetUsersController } from './controllers/user/get-users-controller';
import { AuthUserController } from './controllers/user/auth-user-controller';

const router = Router();

router.get('/users', new GetUsersController().getAll);
router.post('/users', validateSchema(createUserSchema), new CreateUserController().handle);
router.post('/session', validateSchema(authUserSchema), new AuthUserController().handle)
export { router };
