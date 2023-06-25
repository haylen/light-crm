import { z } from 'zod';

export const DeleteItemConfirmationFormSchema = z.object({
  itemId: z.string().nonempty(),
});
