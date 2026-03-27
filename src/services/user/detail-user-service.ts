import { db } from '../../lib/prisma';

export class DetailUserService {
  async execute(userId: string) {
    try {
      const user = await db.user.findFirst({
        where: {
          id: userId,
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

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    } catch (error) {
        console.log(error)
        throw new Error('Usuário não encontrado')
    }
  }
}
