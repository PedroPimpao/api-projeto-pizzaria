import { db } from '../../lib/prisma';

interface DeleteOrderProps {
  order_id: string;
}

export class DeleteOrderService {
  async execute({ order_id }: DeleteOrderProps) {
    try {
      const order = await db.order.findFirst({
        where: {
          id: order_id,
        },
      });

      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      await db.order.delete({
        where: {
          id: order_id,
        },
      });

      return { message: 'Pedido excluido com sucesso' };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao excluir o pedido');
    }
  }
}
