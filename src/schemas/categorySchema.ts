import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .min(2, { message: 'O nome precisa ter no mínimo 2 caracteres' }),
  }),
});

export const getUniqueCategorySchema = z.object({
  query: z.object({
    categoryId: z
      .string({ message: 'O ID da categoria deve ser uma string' })
      .min(1, { message: 'O ID do categoria é obrigatório' }),
  }),
});

export const updateCategoryNameSchema = z.object({
  body: z.object({
    categoryId: z
      .string({ message: 'O ID da categoria deve ser uma string' })
      .min(1, { message: 'O ID do categoria é obrigatório' }),
    newCategoryName: z
      .string({ message: 'Nome é obrigatório' })
      .min(2, { message: 'O nome precisa ter no mínimo 2 caracteres' }),
  }),
});
