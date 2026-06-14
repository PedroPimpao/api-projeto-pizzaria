import { Request, Response } from 'express';
import { GetUniqueCatgoryService } from '../../services/category/get-unique-category-service';

export class GetUniqueCatgoryController {
  async handle(req: Request, res: Response) {
    const category_id = req.query.categoryId as string
    const getCategory = new GetUniqueCatgoryService();
    const category = await getCategory.execute({ category_id });
    return res.status(200).json({ category });
  }
}
