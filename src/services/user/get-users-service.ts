import { db } from '../../lib/prisma';

export class GetUsersService {
  async getAll() {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  }

  // async getUnique(email?: string){
  //     const user = await db.user.findUnique({
  //         where: {
  //             email: email
  //         }
  //     })

  //     if(!user){
  //         throw new Error('Usuário não encontrado')
  //     }

  //     return user
  // }
}
