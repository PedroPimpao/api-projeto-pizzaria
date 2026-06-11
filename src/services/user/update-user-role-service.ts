import { Role } from '@prisma/client';
import { db } from '../../lib/prisma';

export class UpdateUserRoleService {
  async execute(userId: string, newRole: Role) {
    try {
      const user = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          role: newRole,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao atualizar cargo do usuário');
    }
  }
}
