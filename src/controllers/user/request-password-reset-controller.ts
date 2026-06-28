import { Request, Response } from 'express';
import { RequestPasswordResetService } from '../../services/user/request-password-reset-service';

export class RequestPasswordResetController {
  async handle(req: Request, res: Response) {
    const { user_id, email } = req.body;
    const requestReset = new RequestPasswordResetService();
    const response = await requestReset.execute({ userId: user_id, email: email });
    const OTP = response.otpCode;
    const userId = response.userId;
    const data = {
      OTP,
      userId,
    };
    return res.status(200).json(data);
  }
}
