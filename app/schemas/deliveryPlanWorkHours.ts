import { z } from 'zod';
import { TIMEZONE_MAX, TIMEZONE_MIN } from '~/utils/consts/time';

const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const getDateForTimeComparison = (time: string) => {
  const [hours, minutes] = time.split(':');

  return new Date(new Date().setHours(+hours, +minutes, 0, 0));
};

export const WorkHoursSchema = z
  .object({
    isWorkHoursEnabled: z.coerce.boolean().optional(),
    workHoursStart: z
      .string()
      .regex(TIME_REGEX, {
        message: 'Invalid format',
      })
      .optional(),
    workHoursEnd: z
      .string()
      .regex(TIME_REGEX, {
        message: 'Invalid format',
      })
      .optional(),
    workHoursTimezone: z.coerce
      .number()
      .min(TIMEZONE_MIN, { message: `Max value is ${TIMEZONE_MIN}` })
      .max(TIMEZONE_MAX, { message: `Max value is ${TIMEZONE_MAX}` })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isWorkHoursEnabled) return z.NEVER;

    if (
      !Number.isInteger(data.workHoursTimezone) ||
      !data.workHoursStart ||
      !data.workHoursEnd
    ) {
      ctx.addIssue({
        path: ['isWorkHoursEnabled'],
        code: z.ZodIssueCode.custom,
        message: 'Start and end hours are required',
      });
    }

    if (
      data.workHoursStart &&
      data.workHoursEnd &&
      getDateForTimeComparison(data.workHoursStart) >=
        getDateForTimeComparison(data.workHoursEnd)
    ) {
      ctx.addIssue({
        path: ['isWorkHoursEnabled'],
        code: z.ZodIssueCode.custom,
        message: 'The end hours must be after the start hours',
      });
    }
  });
