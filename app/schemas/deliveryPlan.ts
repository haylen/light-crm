import { PaymentType } from '@prisma/client';
import { z } from 'zod';
import { StartEndDatesSchema } from '~/schemas/deliveryPlanStartEndDates';
import { WorkHoursSchema } from '~/schemas/deliveryPlanWorkHours';
import { REQUIRED_FIELD } from '~/utils/consts/errors';

const MAX_PRICE = 999_999_999;

export type FormInput = z.infer<typeof DeliveryPlanSchema>;

export const DeliveryPlanBaseSchema = z.object({
  name: z
    .string()
    .min(1, { message: REQUIRED_FIELD })
    .max(30, { message: 'Max length is 30 characters' }),
  brokerId: z.string().min(1, { message: REQUIRED_FIELD }),
  brokerIntegrationId: z.union([
    z.string().min(1, { message: REQUIRED_FIELD }),
    z.undefined(),
    z.null(),
  ]),
  funnelId: z.union([
    z.string().min(1, { message: REQUIRED_FIELD }),
    z.undefined(),
    z.null(),
  ]),
  buyPrice: z
    .number({ required_error: REQUIRED_FIELD })
    .min(0, { message: 'Min value is 0' })
    .max(MAX_PRICE, { message: `Max value is ${MAX_PRICE}` }),
  sellPrice: z
    .number({ required_error: REQUIRED_FIELD })
    .min(0, { message: 'Min value is 0' })
    .max(MAX_PRICE, { message: `Max value is ${MAX_PRICE}` }),
  dailyCap: z.number().min(1, { message: 'Min value is 1' }).nullish(),
  totalCap: z.number().min(1, { message: 'Min value is 1' }).nullish(),
  paymentType: z.nativeEnum(PaymentType, {
    errorMap: () => ({
      message: REQUIRED_FIELD,
    }),
  }),
});

export const DeliveryPlanSchema =
  DeliveryPlanBaseSchema.and(StartEndDatesSchema).and(WorkHoursSchema);
