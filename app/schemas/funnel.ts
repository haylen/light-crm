import { z } from 'zod';
import { Country } from '~/utils/consts/countries';

export type FormInput = z.infer<typeof FunnelSchema>;

export const FunnelSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'The name must be at least 1 character' })
    .max(30, { message: 'The name must be max 30 characters' }),
  websiteUrl: z
    .string()
    .min(1, { message: 'The url must be at least 1 character' })
    .max(2000, { message: 'The url must be max 2000 characters' }),
  country: z.nativeEnum(Country, {
    errorMap: () => ({
      message: 'Please select a country code from the dropdown',
    }),
  }),
  language: z
    .nativeEnum(Country, {
      errorMap: () => ({
        message: 'Please select a country code from the dropdown',
      }),
    })
    /* Use undefined literal instead of optional() to make language type correct: Country | undefined */
    .or(z.literal(undefined)),
});
