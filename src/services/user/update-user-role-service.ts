import { Role } from '@prisma/client';
import { db } from '../../lib/prisma';

export class UpdateUserRoleService {
  async execute(userId: string, newRole: Role) {
    const userExists = await db.user.findFirst({
      where: {
        id: userId
      }
    })

    if(!userExists){
      throw new Error('Erro: Usuário não encontrado');
    }

    if(userExists.role === newRole){
      throw new Error('Erro: O usuário já possui esse cargo');
    }

    const countSuperAdmins = await db.user.count({
      where: {
        role: 'SUPER_ADMIN'
      }
    })

    if(newRole === 'SUPER_ADMIN' && countSuperAdmins === 1 && userExists.role !== 'SUPER_ADMIN'){
      throw new Error('Erro: Número de SUPER_ADMIN não pode ser maior que 1');
    }

    const countUserRoot = await db.user.count({
      where: {
        role: 'USER_ROOT',
      },
    });

    if (newRole === 'USER_ROOT' && countUserRoot === 1 && userExists.role !== 'USER_ROOT') {
      throw new Error('Erro: Número de USER_ROOT não pode ser maior que 1');
    }

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
