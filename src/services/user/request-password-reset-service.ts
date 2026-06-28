import { db } from '../../lib/prisma';
import { generateOTPCode } from '../../utils/generateOTPCode';

interface RequestPasswordResetServiceProps {
  userId?: string
  email?: string
}

export class RequestPasswordResetService {
  async execute({ userId, email } : RequestPasswordResetServiceProps) {
    const userExists = await db.user.findFirst({
      where: {
        OR: [{ email: email }, { id: userId }],
      },
    });

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    try {
      const userId = userExists.id;
      const otpCode = generateOTPCode();
      const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      await db.user.update({
        where: {
          email: email,
        },
        data: {
          passwordResetOTP: otpCode,
          passwordResetExpires: expirationTime,
          isPasswordResetAuthorized: false,
        },
      });

      return {
        userId,
        otpCode,
      };
    } catch (error) {
      throw new Error('Erro ao solicitar redefnição de senha');
    }
  }
}
