import { db } from '../../lib/prisma';

interface GetUniqueCatgoryServiceProps {
  category_id: string;
}

export class GetUniqueCatgoryService {
  async execute({ category_id }: GetUniqueCatgoryServiceProps) {
    try {
      const category = await db.category.findUnique({
        where: {
          id: category_id,
        },
        select: {
          id: true,
          name: true,
          products: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!category) {
        throw new Error('Categoria não encontrada');
      }
      return category;
    } catch (error) {
      throw new Error(`Erro ao buscar categoria: ${error}`);
    }
  }
}
