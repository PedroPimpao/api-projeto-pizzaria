import { db } from '../../lib/prisma';

interface ListProductByCategoryServiceProps {
  category_id: string;
}

export class ListProductByCategoryService {
  async execute({ category_id }: ListProductByCategoryServiceProps) {
    try {
      const category = await db.category.findUnique({
        where: {
          id: category_id,
        },
      });

      if (!category) {
        throw new Error('Categoria não encontrada');
      }

      const products = await db.products.findMany({
        where: {
          category_id: category_id,
          disabled: false,
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
      console.log(error);
      throw new Error('Erro ao listar produtos por categoria');
    }
  }
}
