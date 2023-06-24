import { z } from 'zod';
import { AVAILABLE_ROLES } from '~/utils/consts/users';

const sharedPasswordConfirmationRefineValidation = (data: {
  password?: string;
  passwordConfirmation?: string;
}) => data.password === data.passwordConfirmation;

const sharedPasswordConfirmationRefineError = {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
};

const PasswordSchema = z
  .string()
  .min(6, { message: 'The password must be at least 6 characters' })
  .max(16, { message: 'The password must be max 16 characters' });

const UserSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field is required' })
    .email('This is not a valid email'),
  roles: z.array(z.enum(AVAILABLE_ROLES)).refine((val) => val.length > 0, {
    message: 'At least one role must be selected',
  }),
  password: PasswordSchema.or(z.literal('')),
  passwordConfirmation: z.string().optional(),
});

export const UpdateUserSchema = UserSchema.refine(
  sharedPasswordConfirmationRefineValidation,
  sharedPasswordConfirmationRefineError,
);

export const CreateUserSchema = UserSchema.extend({
  password: PasswordSchema,
}).refine(
  sharedPasswordConfirmationRefineValidation,
  sharedPasswordConfirmationRefineError,
);

export type FormInput =
  | z.infer<typeof CreateUserSchema>
  | z.infer<typeof UpdateUserSchema>;
