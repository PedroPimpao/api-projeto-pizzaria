import { db } from '../../lib/prisma';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

interface IAuthUserService {
  email: string;
  password: string;
}

interface ITokenPayload {
  name: string;
  email: string;
}

const SECRET = process.env.JWT_SECRET as string;

export class AuthUserService {
  async execute({ email, password }: IAuthUserService) {
    const errorMessage = 'Email ou senha inválido';
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error(errorMessage);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error(errorMessage);
    }

    const TokenPayload: ITokenPayload = {
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(TokenPayload, SECRET, {
      subject: user.id,
      expiresIn: '30d',
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
    };
  }
}
