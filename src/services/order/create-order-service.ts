import { db } from '../../lib/prisma';

interface CreateOrderServiceProps {
  table: number;
  name?: string;
}

export class CreateOrderService {
  async execute({ table, name }: CreateOrderServiceProps) {
    try {
      const order = await db.order.create({
        data: {
          table: table,
          name: name ?? '',
        },
        select: {
          id: true,
          table: true,
          status: true,
          draft: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return order;
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao criar pedido');
    }
  }
}
