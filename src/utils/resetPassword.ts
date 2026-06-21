import { db } from '../lib/prisma';

export const resetPassword = async (userID: string, password: string) => {
  await db.user.update({
    where: {
      id: userID,
    },
    data: {
      password: password,
    },
  });
};
