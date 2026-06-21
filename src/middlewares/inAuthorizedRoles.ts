import { Request, Response, NextFunction } from 'express';
import { db } from '../lib/prisma';
import { Role } from '@prisma/client';

export function inAuthorizedRoles(...roles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user_id;

    if (!userId) {
      return res.status(401).json({
        error: 'Acesso negado',
      });
    }

    const user = await db.user.findFirst({
        where: {
            id: userId
        }
    })

    if (!user) {
      return res.status(401).json({
        error: 'Acesso negado',
      });
    }

    const userRole = user?.role
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        error: 'Acesso negado',
      });
    }

    return next();
  };
}
