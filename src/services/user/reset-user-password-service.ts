import { compare, hash } from 'bcryptjs';
import { db } from '../../lib/prisma';
import { resetPassword } from '../../utils/resetPassword';

interface ResetUserPasswordServiceProps {
  userID: string;
  currentPassword: string;
  newPassword: string;
}

export class ResetUserPasswordService {
  async execute({ userID, currentPassword, newPassword }: ResetUserPasswordServiceProps) {
    const errorMessage = 'Email ou senha inválido';
    const userExists = await db.user.findUnique({
      where: {
        id: userID,
      },
    });

    if (!userExists) {
      throw new Error('Erro: Usuário não encontrado');
    }

    const passwordMatch = await compare(currentPassword, userExists.password);

    if (!passwordMatch) {
      throw new Error(errorMessage);
    }

    const newPasswordHashed = await hash(newPassword, 12);
    try {
      await resetPassword(userID, newPasswordHashed);
    } catch (error) {
      throw new Error('Erro ao redefinir a senha');
    }
  }
}
