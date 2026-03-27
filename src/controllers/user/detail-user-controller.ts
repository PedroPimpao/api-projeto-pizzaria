import { Request, Response } from 'express'
import { DetailUserService } from '../../services/user/detail-user-service'

export class DetailUserController {
    async handle(req: Request, res: Response){
        const { user_id } = req.body
        const detailUser = new DetailUserService()
        const user = await detailUser.execute(user_id as string)

        return res.status(200).json(user)
    }
}