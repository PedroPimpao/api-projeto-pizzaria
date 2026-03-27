import { Request, Response, NextFunction } from 'express';
import { db } from '../lib/prisma';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
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
  
  if(user.role !== 'ADMIN'){
    return res.status(401).json({
      error: 'Acesso negado - Requer ADMIN',
    });
  }

  return next();
};
