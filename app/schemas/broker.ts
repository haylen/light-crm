import { z } from 'zod';

export type FormInput = z.infer<typeof BrokerSchema>;

export const BrokerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'The name must be at least 1 character' })
    .max(20, { message: 'The name must be max 20 characters' }),
  managerPercentage: z
    .number()
    .min(0, { message: 'The percentage must be at least 0' })
    .max(100, { message: 'The percentage must be max 100' })
    .optional(),
  managerId: z.string().optional(),
});
