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

export const resetUserPasswordSchema = z.object({
  body: z.object({
    user_id: z
      .string({ message: 'O ID do usuario deve ser uma string' })
      .min(1, { message: 'O ID do usuario e obrigatorio' }),
    current_password: z
      .string({ message: 'A senha atual e obrigatoria' })
      .min(1, { message: 'A senha atual e obrigatoria' }),
    new_password: z
      .string({ message: 'A nova senha e obrigatoria' })
      .min(6, { message: 'A nova senha precisa ter no minimo 6 caracteres' }),
    confirm_new_password: z
      .string({ message: 'A confirmacao da nova senha e obrigatoria' })
      .min(6, { message: 'A confirmacao da nova senha precisa ter no minimo 6 caracteres' }),
  }),
});

export const resetUserEmailSchema = z.object({
  body: z.object({
    user_id: z
      .string({ message: 'O ID do usuario deve ser uma string' })
      .min(1, { message: 'O ID do usuario e obrigatorio' }),
    password: z
      .string({ message: 'A senha e obrigatoria' })
      .min(1, { message: 'A senha e obrigatoria' }),
    new_email: z.email({ message: 'Precisa ser um email valido' }),
  }),
});

export const updateUsernameSchema = z.object({
  body: z.object({
    user_id: z
      .string({ message: 'O ID do usuario deve ser uma string' })
      .min(1, { message: 'O ID do usuario e obrigatorio' }),
    new_name: z
      .string({ message: 'O novo nome e obrigatorio' })
      .min(3, { message: 'O novo nome precisa ter no minimo 3 caracteres' }),
  }),
});

export const requestPasswordResetSchema = z.object({
  body: z
    .object({
      user_id: z
        .string({ message: 'O ID do usuario deve ser uma string' })
        .min(1, { message: 'O ID do usuario e obrigatorio' })
        .optional(),
      email: z.email({ message: 'Precisa ser um email valido' }).optional(),
    })
    .refine((data) => data.user_id || data.email, {
      message: 'Informe o ID do usuario ou o email',
      path: ['email'],
    }),
});

export const codeValidationSchema = z.object({
  body: z.object({
    user_id: z
      .string({ message: 'O ID do usuario deve ser uma string' })
      .min(1, { message: 'O ID do usuario e obrigatorio' }),
    otp_code: z
      .string({ message: 'O codigo OTP deve ser uma string' })
      .min(1, { message: 'O codigo OTP e obrigatorio' }),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    user_id: z
      .string({ message: 'O ID do usuario deve ser uma string' })
      .min(1, { message: 'O ID do usuario e obrigatorio' }),
    new_password: z
      .string({ message: 'A nova senha e obrigatoria' })
      .min(6, { message: 'A nova senha precisa ter no minimo 6 caracteres' }),
    confirm_new_password: z
      .string({ message: 'A confirmacao da nova senha e obrigatoria' })
      .min(6, { message: 'A confirmacao da nova senha precisa ter no minimo 6 caracteres' }),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    user_id: z
      .string({ message: 'O ID do usuario deve ser uma string' })
      .min(1, { message: 'O ID do usuario e obrigatorio' }),
    role: z.enum(['EXTERNAL', 'STAFF', 'ADMIN', 'SUPER_ADMIN', 'USER_ROOT'], {
      message: 'Cargo invalido',
    }),
  }),
});

export const authUserSchema = z.object({
  body: z.object({
    email: z.email({ message: 'Precisa ser um email valido' }),
    password: z
      .string({ message: 'A senha é obrigatória' })
      .min(1, { message: 'A senha é obrigatória' }),
  }),
});
