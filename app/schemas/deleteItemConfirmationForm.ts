import { z } from 'zod';

export const DeleteItemConfirmationFormSchema = z.object({
  method: z.literal('deleteItem'),
  itemId: z.string().nonempty(),
});
