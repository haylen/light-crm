import { z } from 'zod';
import { REQUIRED_FIELD } from '~/utils/consts/errors';
import { TIMEZONE_MAX, TIMEZONE_MIN } from '~/utils/consts/time';

const dateErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_date) {
    return { message: REQUIRED_FIELD };
  }

  return { message: ctx.defaultError };
};

const getStartDateMin = () => new Date(new Date().setHours(0, 0, 0, 0));

export const StartEndDatesSchema = z
  .object({
    startDate: z.coerce
      .date({
        errorMap: dateErrorMap,
      })
      .min(getStartDateMin(), {
        message: 'Min value is today',
      }),
    endDate: z.coerce.date({
      errorMap: dateErrorMap,
    }),
    startEndDatesTimezone: z.coerce
      .number()
      .min(TIMEZONE_MIN, { message: `Max value is ${TIMEZONE_MIN}` })
      .max(TIMEZONE_MAX, { message: `Max value is ${TIMEZONE_MAX}` }),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'Must be after the start date',
    path: ['endDate'],
  });
