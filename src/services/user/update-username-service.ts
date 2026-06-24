import { db } from '../../lib/prisma';

interface UpdateUsernameServiceProps {
  userId: string;
  newName: string;
}

export class UpdateUsernameService {
  async execute({ userId, newName }: UpdateUsernameServiceProps) {
    const userExists = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    if (userExists.name === newName) {
      throw new Error('O novo nome é igual ao antigo');
    }

    try {
      const user = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name: newName,
        },
      });

      return user;
    } catch (error) {
      console.log(`Erro ao atualizar nome do usuário. Erro: ${error}`);
      throw new Error('Erro ao atualizar nome do usuário');
    }
  }
}
