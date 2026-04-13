import { db } from '../../lib/prisma';

interface DeleteProductServiceProps {
  product_id: string;
}

export class DeleteProductService {
  async execute({ product_id }: DeleteProductServiceProps) {
    try {
      await db.products.update({
        where: {
          id: product_id,
        },
        data: {
          disabled: true,
        },
      });

      return { message: 'Produto deletado/arquivado com sucesso' };
    } catch (error) {
      console.log(error);
      throw new Error('Falha ao deletar o produto');
    }
  }
}
