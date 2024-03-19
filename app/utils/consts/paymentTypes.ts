import { PaymentType } from '@prisma/client';

export const MAP_PAYMENT_TYPE_KEY_TO_LABEL = {
  [PaymentType.Cpa]: 'CPA',
  [PaymentType.Cpl]: 'CPL',
  [PaymentType.CpaCrg]: 'CPA - CRG',
};
