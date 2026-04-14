import { Request, Response } from 'express';
import { RemoveItemOrderService } from '../../services/order/remove-item-order-service';

export class RemoveItemOrderController {
  async handle(req: Request, res: Response) {
    const item_id = req.query?.item_id;
    const removeItemOrderService = new RemoveItemOrderService();
    const result = await removeItemOrderService.execute({ item_id: item_id as string });
    return res.status(200).json(result);
  }
}
