import { Request, Response } from 'express';
import { CheckOtpCodeService } from '../../services/user/check-otpcode-service';
export class CheckOtpCodeController {
  async handle(req: Request, res: Response) {
    const { user_id, otp_code } = req.body;
    const checkOtpCode = new CheckOtpCodeService();
    await checkOtpCode.execute({ userId: user_id, otpCode: otp_code });
    res.status(200).json({ message: 'Código validado com sucesso!' });
  }
}
