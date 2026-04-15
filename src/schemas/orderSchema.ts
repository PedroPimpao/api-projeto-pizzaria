import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number({ message: 'O número da mesa é obrigatório' })
      .int({ message: 'O número da mesa deve ser um inteiro' })
      .positive({ message: 'O número da mesa deve ser um número positivo' }),
    name: z.string().optional(),
  }),
});

export const addItemSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: 'O ID do pedido deve ser uma string' })
      .min(1, { message: 'O ID do item é obrigatório' }),
    product_id: z
      .string({ message: 'O ID do produto deve ser uma string' })
      .min(1, { message: 'O ID do item é obrigatório' }),
    amount: z
      .number()
      .int('O valor deve ser um número inteiro')
      .positive('O valor deve ser um número positivo'),
  }),
});

export const removeItemSchema = z.object({
  query: z.object({
    item_id: z
      .string({ message: 'O ID do item deve ser uma string' })
      .min(1, { message: 'O ID do item é obrigatório' }),
  }),
});

export const orderDetailSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: 'O ID do pedido deve ser uma string' })
      .min(1, { message: 'O ID do pedido é obrigatório' }),
  }),
});

export const sendOrderSchema = z.object({
  body: z.object({
    order_id: z.string({ message: 'O ID do pedido deve ser uma string' })
      .min(1, { message: 'O ID do pedido é obrigatório' }),
    name: z.string().optional(),
  })
})