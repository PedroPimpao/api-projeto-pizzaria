import { Request, Response } from 'express';
import { RequestPasswordResetService } from '../../services/user/request-password-reset-service';

export class RequestPasswordResetController {
  async handle(req: Request, res: Response) {
    const { email } = req.body;
    const requestReset = new RequestPasswordResetService();
    const OTP = requestReset.execute(email);
    return res.status(200).json(OTP);
  }
}
