import { db } from '../../lib/prisma';

interface CheckOtpCodeServiceProps {
  userId: string;
  otpCode: string;
}

export class CheckOtpCodeService {
  async execute({ userId, otpCode }: CheckOtpCodeServiceProps) {
    const userExists = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    if (userExists.passwordResetOTP !== otpCode) {
      throw new Error('Código OTP inválido');
    }

    if (!userExists.passwordResetExpires || userExists.passwordResetExpires < new Date()) {
      throw new Error('Código expirado');
    }

    try {
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          isPasswordResetAuthorized: true,
          passwordResetOTP: null,
          passwordResetExpires: null,
        },
      });
    } catch (error) {
      console.log(`Erro ao validar código OTP. Erro: ${error}`);
      throw new Error('Erro ao validar código OTP');
    }
  }
}
