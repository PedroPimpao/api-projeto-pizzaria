import { Request, Response } from 'express';
import { UpdateUsernameService } from '../../services/user/update-username-service';
export class UpdateUsernameController {
  async handle(req: Request, res: Response) {
    const { user_id, new_name } = req.body;
    const updateUsername = new UpdateUsernameService();
    const user = await updateUsername.execute({ userId: user_id, newName: new_name });
    return res.status(200).json(user);
  }
}
