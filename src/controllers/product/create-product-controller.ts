import { Request, Response } from 'express';
import { CreateProductService } from '../../services/product/create-product-service';

export class CreateProductController {
    async handle (_req: Request, res: Response){
        const createProduct = new CreateProductService()
        const product = await createProduct.execute()
        res.status(201).json(product)
    }
}