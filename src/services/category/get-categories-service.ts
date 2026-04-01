import { db } from '../../lib/prisma';

export class GetCategoriesService {
  async getAll() {
    try {
      const categories = await db.category.findMany({
        select: {
          id: true,
          name: true,
          products: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return categories;
    } catch (error) {
      console.log(`Erro ao buscar categorias: ${error}`);
      throw new Error('Falha ao buscar categorias');
    }
  }
}
