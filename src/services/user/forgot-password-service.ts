import { hash } from 'bcryptjs';
import { db } from '../../lib/prisma';
import { resetPassword } from '../../utils/resetPassword';

interface ForgotPasswordServiceProps {
  userId: string;
  newPassword: string;
  confirmNewPassword: string;
}

export class ForgotPasswordService {
  async execute({ userId, newPassword, confirmNewPassword }: ForgotPasswordServiceProps) {
    let newPasswordMatch = false 
    const userExists = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    if (!userExists.isPasswordResetAuthorized) {
      throw new Error('Ação não autorizada');
    }

    if(newPassword === confirmNewPassword){
      newPasswordMatch = true
    }
    
    if (!newPasswordMatch) {
      throw new Error('As senhas não coincidem');
    }

    const newPasswordHash = await hash(newPassword, 12);

    try {
      await resetPassword(userId, newPasswordHash);
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          isPasswordResetAuthorized: false,
          passwordResetOTP: null,
          passwordResetExpires: null,
        },
      });
    } catch (error) {
      throw new Error('Erro ao redefinir senha');
    }
  }
}
