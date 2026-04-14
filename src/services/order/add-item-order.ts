import { db } from '../../lib/prisma';

interface ItemProps {
  order_id: string;
  product_id: string;
  amount: number;
}

export class AddItemOrderService {
  async execute({ order_id, product_id, amount }: ItemProps) {
    try {
      const orderExists = await db.order.findFirst({
        where: {
          id: order_id,
        },
      });

      const productExists = await db.products.findFirst({
        where: {
          id: product_id,
          disabled: false,
        },
      });

      if (!orderExists) {
        throw new Error('Pedido não encontrado');
      }

      if (!productExists) {
        throw new Error('Produto não encontrado');
      }

      const item = await db.item.create({
        data: {
          order_id: order_id,
          product_id: product_id,
          amount: amount,
        },
        select: {
          id: true,
          amount: true,
          order_id: true,
          product_id: true,
          createdAt: true,
          updatedAt: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              category: true,
              banner: true,
            },
          },
        },
      });
      return item;
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao adicionar item ao pedido');
    }
  }
}
