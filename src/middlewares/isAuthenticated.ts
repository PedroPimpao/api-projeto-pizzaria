import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

interface Payload {
  sub: string;
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;
  const SECRET = process.env.JWT_SECRET as string;

  if (!authToken) {
    return res.status(401).json({
      error: 'Acesso negado',
    });
  }

  const [, token] = authToken.split(' ');

  try {
    const { sub } = jwt.verify(token!, SECRET) as Payload;
    req.user_id = sub;

    return next();
  } catch (error) {
    res.status(401).json({
      error: 'Acesso negado',
    });
  }
  return next();
};
