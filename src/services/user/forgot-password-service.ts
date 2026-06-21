import { compare, hash } from 'bcryptjs';
import { db } from '../../lib/prisma';
import { resetPassword } from '../../utils/resetPassword';

interface ForgotPasswordServiceProps {
  otpCode: string;
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

export class ForgotPasswordService {
  async execute({ otpCode, email, newPassword, confirmNewPassword }: ForgotPasswordServiceProps) {
    const userExists = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    if (otpCode !== userExists.passwordResetOTP) {
      throw new Error('Código OTP inválido');
    }

    const newPasswordHash = await hash(newPassword, 12);
    const confirmNewPasswordHash = await hash(confirmNewPassword, 12);
    const newPasswordMatch = await compare(newPasswordHash, confirmNewPasswordHash);

    if (!newPasswordMatch) {
      throw new Error('As senhas não coincidem');
    }

    try {
      await resetPassword(userExists.id, newPasswordHash);
    } catch (error) {
      throw new Error('Erro ao redefinir senha');
    }
  }
}
