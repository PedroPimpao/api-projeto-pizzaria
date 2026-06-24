import { Request, Response } from 'express';
import { RequestPasswordResetService } from '../../services/user/request-password-reset-service';

export class RequestPasswordResetController {
  async handle(req: Request, res: Response) {
    const { email } = req.body;
    const requestReset = new RequestPasswordResetService();
    const response = await requestReset.execute(email);
    const OTP = response.otpCode;
    const userId = response.userId;
    const data = {
      OTP,
      userId,
    };
    return res.status(200).json(data);
  }
}
