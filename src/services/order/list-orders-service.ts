import { db } from '../../lib/prisma';

interface ListOrdersServiceProps {
  draft?: string;
  status?: string;
}

export class ListOrdersService {
  async execute({ draft, status }: ListOrdersServiceProps) {
    const orders = await db.order.findMany({
      where: {
        draft: draft === 'true' ? true : false,
        status: status === 'true' ? true : false,
      },
      select: {
        id: true,
        table: true,
        name: true,
        draft: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            amount: true,
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
    return orders;
  }
}
