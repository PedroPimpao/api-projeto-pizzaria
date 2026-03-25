import { Request, Response } from 'express';
import { AuthUserService } from '../../services/user/auth-user-service';

export class AuthUserController{
    async handle(req: Request, res: Response){
        const { email, password } = req.body
        // console.log({ email, password })
        const authUserService = new AuthUserService()
        const session = await authUserService.execute({ email, password });
        res.status(200).json(session)
    }
}