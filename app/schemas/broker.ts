import { z } from 'zod';

export type FormInput = z.infer<typeof BrokerSchema>;

export const BrokerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'The name must be at least 1 character' })
    .max(20, { message: 'The name must be max 20 characters' }),
});
