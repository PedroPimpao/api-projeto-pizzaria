import { db } from '../../lib/prisma';
import { hash } from 'bcryptjs';

interface ICreateUserService {
  name: string;
  email: string;
  password: string;
}

export class CreateUserService {
  async execute({ name, email, password }: ICreateUserService) {
    const userExists = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userExists) {
      throw new Error('Usuário já existe');
    }

    const passwordHash = await hash(password, 12);

    const user = await db.user.create({
      data: {
        name: name,
        email: email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        password: false,
      },
    });
    // console.log(user);
    return user;
  }
}
