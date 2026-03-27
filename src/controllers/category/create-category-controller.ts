import { Request, Response } from 'express'
import { CreateCategoryService } from '../../services/category/create-category-service'

export class CreateCategoryController {
    async handle(req: Request, res: Response){
        const { name } = req.body

        const createCategory = new CreateCategoryService()
        const category = await createCategory.execute({ name })

        return res.status(201).json({category})
    }
}