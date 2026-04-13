import { db } from '../../lib/prisma';

interface ListProductServiceProps {
  disabled?: string;
}

export class ListProductService {
  async execute({ disabled }: ListProductServiceProps) {
    try {
      const products = await db.products.findMany({
        where: {
          disabled: disabled === 'true' ? true : false,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          banner: true,
          category_id: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return products;
    } catch (error) {
      throw new Error('Falha ao buscar produtos');
    }
  }
}
