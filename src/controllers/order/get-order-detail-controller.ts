import { Request, Response } from 'express';
import { GetOrderDetailService } from '../../services/order/get-order-detail-service';

export class GetOrderDetailController {
  async handle(req: Request, res: Response) {
    const { order_id } = req.query;
    const detailOrder = new GetOrderDetailService();
    const order = await detailOrder.execute({ order_id: order_id as string });
    return res.status(200).json(order);
  }
}
