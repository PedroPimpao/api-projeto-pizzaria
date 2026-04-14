import { db } from '../../lib/prisma';

interface GetOrderDetailProps {
  order_id: string;
}

export class GetOrderDetailService {
  async execute({ order_id }: GetOrderDetailProps) {
    try {
      const order = await db.order.findFirst({
        where: {
          id: order_id,
        },
        select: {
          id: true,
          table: true,
          name: true,
          status: true,
          draft: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              id: true,
              amount: true,
              createdAt: true,
              updatedAt: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  description: true,
                  banner: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new Error('Pedido não encontrado');
      }

      return order;
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao buscar detalhes do pedido');
    }
  }
}
