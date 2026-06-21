import { Request, Response } from 'express';
import { ResetUserEmailService } from '../../services/user/reset-user-email-service';

export class ResetUserEmailController {
  async handle(req: Request, res: Response) {
    const { user_id, password, new_email } = req.body;
    const resetUserEmailService = new ResetUserEmailService();
    const user = await resetUserEmailService.execute({
      userID: user_id,
      password: password,
      newEmail: new_email,
    });
    return res.status(200).json(user);
  }
}
