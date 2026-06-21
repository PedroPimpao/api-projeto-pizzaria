import { compare } from 'bcryptjs';
import { db } from '../../lib/prisma';

interface ResetUserEmailServiceProps {
  userID: string;
  password: string;
  newEmail: string;
}

export class ResetUserEmailService {
  async execute({ userID, password, newEmail }: ResetUserEmailServiceProps) {
    const userExists = await db.user.findUnique({
      where: {
        id: userID,
      },
    });

    if (!userExists) {
      throw new Error('Erro: Usuário não encontrado');
    }

    const passwordMatch = await compare(password, userExists.password);

    if (!passwordMatch) {
      throw new Error('Senha inválida');
    }

    if (newEmail === userExists.email) {
      throw new Error('O novo email é igual ao antigo');
    }

    try {
      const user = await db.user.update({
        where: {
          id: userID,
        },
        data: {
          email: newEmail,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return user;
    } catch (error) {
      throw new Error('Erro ao redefinir a email');
    }
  }
}
