import { Request, Response } from 'express';
import { CreateUserService } from '../../services/user/create-user-service';

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;
    console.log({ name, email, password });
    const createUserService = new CreateUserService();
    const user = await createUserService.execute();
    res.status(200).json({ message: user });
  }
}
