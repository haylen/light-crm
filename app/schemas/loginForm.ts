import { z } from 'zod';

export type FormInput = z.infer<typeof LoginSchema>;

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address',
  }),
  password: z
    .string()
    .min(6, { message: 'The password must be at least 6 characters' })
    .max(16, { message: 'The password must be max 16 characters' }),
});
