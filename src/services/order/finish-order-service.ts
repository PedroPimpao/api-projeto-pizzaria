import { db } from '../../lib/prisma';

interface FinishOrderServiceProps {
  order_id: string;
}

export class FinishOrderService {
  async execute({ order_id }: FinishOrderServiceProps) {
    try {
      const order = await db.order.findFirst({
        where: {
          id: order_id,
        },
      });

      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      const updateOrder = await db.order.update({
        where: {
          id: order_id,
        },
        data: {
          status: true,
        },
        select: {
          id: true,
          table: true,
          name: true,
          draft: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updateOrder;
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao finalizar o pedido');
    }
  }
}
