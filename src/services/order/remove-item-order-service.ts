import { db } from '../../lib/prisma';

interface RemoveItemOrderProps {
  item_id: string;
}

export class RemoveItemOrderService {
  async execute({ item_id }: RemoveItemOrderProps) {
    try {
      const itemExists = await db.item.findFirst({
        where: {
          id: item_id,
        },
      });

      if (!itemExists) {
        throw new Error('Item não encontrado');
      }

      await db.item.delete({
        where: {
          id: item_id,
        },
      });

      return { message: 'Item removido com sucesso!' };
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao remover item do pedido');
    }
  }
}
