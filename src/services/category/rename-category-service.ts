import { db } from '../../lib/prisma';

interface RenameCategoryServiceProps {
  categoryId: string;
  newCategoryName: string;
}

export class RenameCategoryService {
  async execute({ categoryId, newCategoryName }: RenameCategoryServiceProps) {
    const categoryExists = await db.category.findFirst({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
        products: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!categoryExists) {
      throw new Error('Categoria não existe');
    }

    try {
      const category = await db.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name: newCategoryName,
        },
      });
      return category;
    } catch (error) {
      if (!categoryExists) {
        throw new Error('Categoria não existe');
      }
      console.log(`Erro ao atualizar o nome da categoria: ${error}`);
      throw new Error('Erro ao atualizar o nome da categoria');
    }
  }
}
