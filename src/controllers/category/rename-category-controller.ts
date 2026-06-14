import { Request, Response } from 'express';
import { RenameCategoryService } from '../../services/category/rename-category-service';

export class RenameCategoryController {
  async handle(req: Request, res: Response) {
    const { categoryId, newCategoryName } = req.body
    const renameCategory = new RenameCategoryService()
    const category = renameCategory.execute({
        categoryId: categoryId,
        newCategoryName: newCategoryName
    })
    return res.status(200).json({ category });
  }
}
