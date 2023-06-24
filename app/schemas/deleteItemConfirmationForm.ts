import { z } from 'zod';
import { ActionType } from '~/utils/consts/formActions';

export const DeleteItemConfirmationFormSchema = z.object({
  method: z.literal(ActionType.DeleteItemConfirmation),
  itemId: z.string().nonempty(),
});
