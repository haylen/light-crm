import { z } from 'zod';
import { REQUIRED_FIELD } from '~/utils/consts/errors';
import { TIMEZONE_MAX, TIMEZONE_MIN } from '~/utils/consts/time';

const dateErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (
    issue.code === z.ZodIssueCode.invalid_date ||
    issue.code === z.ZodIssueCode.invalid_type
  ) {
    return { message: REQUIRED_FIELD + 'wew' };
  }

  return { message: ctx.defaultError };
};

export const StartEndDatesSchema = z
  .object({
    startDate: z
      .union([
        z.string({
          invalid_type_error: REQUIRED_FIELD,
          required_error: REQUIRED_FIELD,
        }),
        z.date({
          invalid_type_error: REQUIRED_FIELD,
          required_error: REQUIRED_FIELD,
        }),
      ])
      .pipe(
        z.coerce.date({
          errorMap: dateErrorMap,
        }),
      ),
    endDate: z
      .union([
        z.string({
          invalid_type_error: REQUIRED_FIELD,
          required_error: REQUIRED_FIELD,
        }),
        z.date({
          invalid_type_error: REQUIRED_FIELD,
          required_error: REQUIRED_FIELD,
        }),
      ])
      .pipe(
        z.coerce.date({
          errorMap: dateErrorMap,
        }),
      ),
    startEndDatesTimezone: z
      .number()
      .min(TIMEZONE_MIN, { message: `Max value is ${TIMEZONE_MIN}` })
      .max(TIMEZONE_MAX, { message: `Max value is ${TIMEZONE_MAX}` }),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Must be after the start date',
    path: ['endDate'],
  });
