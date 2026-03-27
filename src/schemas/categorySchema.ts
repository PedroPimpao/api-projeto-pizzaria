import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .min(2, { message: 'O nome precisa ter no mínimo 2 caracteres' }),
  }),
});
