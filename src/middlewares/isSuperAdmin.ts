import { Request, Response, NextFunction } from 'express';
import { db } from '../lib/prisma';

export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user_id;

  if (!userId) {
    return res.status(401).json({
      error: 'Acesso negado',
    });
  }

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(401).json({
      error: 'Acesso negado',
    });
  }

  if (user.role !== 'SUPER_ADMIN' && user.role !== 'USER_ROOT') {
    return res.status(401).json({
      error: 'Acesso negado - Requer SUPER_ADMIN ou USER_ROOT',
    });
  }

  return next();
};
