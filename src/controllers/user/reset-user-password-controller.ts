import { Request, Response } from 'express';
import { ResetUserPasswordService } from '../../services/user/reset-user-password-service';

export class ResetUserPasswordController {
  async handle(req: Request, res: Response) {
    const { user_id, current_password, new_password } = req.body;
    const resetUserPasswordService = new ResetUserPasswordService();
    await resetUserPasswordService.execute({
      userID: user_id,
      currentPassword: current_password,
      newPassword: new_password,
    });
    return res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  }
}
