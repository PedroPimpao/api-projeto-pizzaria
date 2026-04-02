import { Request, Response } from 'express';
import { CreateProductService } from '../../services/product/create-product-service';

export class CreateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, category_id } = req.body;

    if (!req.file) {
      throw new Error('Imagem é obrigatória');
    }

    const createProduct = new CreateProductService();
    const product = await createProduct.execute({
      name,
      price: parseInt(price),
      description,
      category_id,
      imageBuffer: req.file.buffer,
      imageName: req.file.originalname,
    });
    res.status(201).json(product);
  }
}
