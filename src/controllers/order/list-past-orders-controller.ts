import { Request, Response } from 'express';
import { ListPastOrdersService } from '../../services/order/list-past-orders-service';

export class ListPastOrdersController {
  async handle(req: Request, res: Response) {
    const draft = req.query?.draft as string | undefined;
    const status = req.query?.status as string | undefined;
    const listOrders = new ListPastOrdersService();
    const orders = await listOrders.execute({
      draft: draft,
      status: status,
    });
    return res.status(200).json(orders);
  }
}
