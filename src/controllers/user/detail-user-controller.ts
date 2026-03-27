import { Request, Response } from 'express'
import { DetailUserService } from '../../services/user/detail-user-service'

export class DetailUserController {
    async handle(req: Request, res: Response){
        const user_id = req.user_id
        const detailUser = new DetailUserService()
        const user = await detailUser.execute(user_id)

        return res.status(200).json(user)
    }
}