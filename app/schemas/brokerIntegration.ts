import { z } from 'zod';
import { REQUIRED_FIELD } from '~/utils/consts/errors';

export type FormInput = z.infer<typeof BrokerIntegrationSchema>;

export const BrokerIntegrationSchema = z.object({
  name: z
    .string()
    .min(1, { message: REQUIRED_FIELD })
    .max(20, { message: 'Max length is 20 characters' }),
});
