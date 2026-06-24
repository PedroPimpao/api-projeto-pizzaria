import { Request, Response } from 'express';
import { ForgotPasswordService } from '../../services/user/forgot-password-service';

export class ForgotPasswordController {
  async handle(req: Request, res: Response) {
    const { user_id, new_password, confirm_new_password } = req.body;
    const forgotPasswordService = new ForgotPasswordService();
    await forgotPasswordService.execute({
      userId: user_id,
      newPassword: new_password,
      confirmNewPassword: confirm_new_password,
    });
    return res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  }
}
