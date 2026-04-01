import { Request, Response } from 'express';
import { GetCategoriesService } from '../../services/category/get-categories-service';

export class GetCategoriesController {
  async getAll(_: Request, res: Response) {
    const getCategoriesService = new GetCategoriesService();
    const categories = await getCategoriesService.getAll();

    return res.status(200).json(categories);
  }
}
