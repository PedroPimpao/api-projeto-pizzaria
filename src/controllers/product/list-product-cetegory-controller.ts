import { Request, Response } from 'express';
import { ListProductByCategoryService } from '../../services/product/list-product-category-service';

export class ListProductByCategoryController {
  async handle(req: Request, res: Response) {
    const category_id = req.query?.category_id as string;
    const listProductByCategory = new ListProductByCategoryService();
    const products = await listProductByCategory.execute({
      category_id: category_id,
    });

    return res.status(200).json(products);
  }
}
