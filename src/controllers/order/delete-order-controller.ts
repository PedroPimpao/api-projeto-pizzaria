import { Request, Response } from 'express';
import { DeleteOrderService } from '../../services/order/delete-order-service';

export class DeleteOrderController {
  async handle(req: Request, res: Response) {
    const order_id = req.query?.order_id as string;

    const deleteOrder = new DeleteOrderService();
    const order = await deleteOrder.execute({
      order_id,
    });

    return res.status(200).json(order);
  }
}