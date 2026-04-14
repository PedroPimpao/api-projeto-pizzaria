import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Nome é obrigatório' }).min(3, { message: 'Mínimo de 3 caracteres' }),
    price: z.string().min(1, { message: 'O valor do produto é obrigatório' }).regex(/^\d+$/),
    description: z.string().min(1, { message: 'A descrição do produto é obrigatória' }),
    category_id: z.string().min(1, { message: 'A categoria do produto é obrigatória' }),
  }),
});

export const listProductSchema = z.object({
  query: z.object({
    disabled: z
      .enum(['true', 'false'], { message: 'O campo disabled deve ser true ou false' })
      .optional()
      .default('false')
      .transform((value) => value === 'true'),
  }),
});

export const listProductByCategorySchema = z.object({
  query: z.object({
    category_id: z.string({ message: 'O ID da categoria deve ser uma string' }).min(1, { message: 'O ID da categoria é obrigatório' }),
  }),
});
