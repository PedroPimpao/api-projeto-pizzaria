import { Request, Response } from 'express';
import { UpdateUserRoleService } from '../../services/user/update-user-role-service';

export class UpdateUserRoleController {
  async handle(req: Request, res:Response) {
    const { user_id, role } = req.body
    const updateRoleService = new UpdateUserRoleService()
    const user = await updateRoleService.execute(user_id, role)
    return res.status(201).json(user);
  }
}
