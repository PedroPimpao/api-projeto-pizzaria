import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, { message: 'O nome precisa ter no mínimo 3 caracteres' }),
    email: z.email({ message: 'Precisa ser um email valido' }),
    password: z
      .string({ message: 'A senha é obrigatória' })
      .min(6, { message: 'A senha precisa ter no mínimo 6 caracteres' }),
  }),
});
