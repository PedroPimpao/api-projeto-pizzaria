import { Request, Response } from "express";
import { GetUsersService } from "../../services/user/get-users-service";

export class GetUsersController {
  async getAll(_: Request, res: Response) {
    const getUsersService = new GetUsersService()
    const users = await getUsersService.getAll()
    res.status(200).json(users)
  }
}