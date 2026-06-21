import { db } from '../../lib/prisma';
import { generateOTPCode } from '../../utils/generateOTPCode';

export class RequestPasswordResetService {
  async execute(email: string) {
    const userExists = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      throw new Error('Usuário não encontrado');
    }

    try {
      const otpCode = generateOTPCode();
      const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      await db.user.update({
        where: {
          email: email,
        },
        data: {
          passwordResetOTP: otpCode,
          passwordResetExpires: expirationTime,
        },
      });
      return otpCode;
    } catch (error) {
      throw new Error('Erro ao solicitar redefnição de senha');
    }
  }
}
