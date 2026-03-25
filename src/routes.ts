import { Router } from 'express';
import { CreateUserController } from './controllers/user/create-user-controller';
import { validateSchema } from './middlewares/validateSchema';
import { createUserSchema } from './schemas/userSchema';
import { GetUsersController } from './controllers/user/get-users-controller';


const router = Router();

router.get('/users', new GetUsersController().getAll)
router.post('/users', validateSchema(createUserSchema), new CreateUserController().handle);
export { router };
