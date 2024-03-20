import { Form } from '@remix-run/react';
import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { ModalSubmitButton } from '~/components/ModalSubmitButton';
import type { FormInput } from '~/schemas/user';
import { AVAILABLE_ROLES } from '~/utils/consts/users';

type UserFormProps = {
  isNew?: boolean;
  submitLabel: string;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  formError: string | undefined;
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
  onSubmit: () => void;
};

export const UserForm = ({
  isNew = false,
  submitLabel,
  isSubmitDisabled,
  isSubmitting,
  formError,
  formMethods,
  onSubmit,
}: UserFormProps) => (
  <Form method="post" onSubmit={onSubmit}>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Email</span>
      </label>
      <input
        type="email"
        id="email"
        placeholder="Email"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.email?.message && 'input-error',
        )}
        {...formMethods.register('email')}
      />
    </div>

    <p className="h-4 text-error text-xs mt-2 pl-1">
      {formMethods.formState.errors?.email?.message}
    </p>

    <div className="divider text-sm font-semibold">Choose roles</div>

    <fieldset className="flex flex-wrap justify-between gap-x-8">
      {AVAILABLE_ROLES.map((role, index) => (
        <div key={role} className="form-control w-40">
          <label className="label cursor-pointer justify-start gap-4">
            {/* TODO: Fix the error: "UserForm contains an input of type checkbox with both value and defaultValue props" */}
            <input
              type="checkbox"
              id={`roles[${index}}]`}
              className="checkbox"
              {...formMethods.register('roles')}
              value={role}
            />
            <span className="label-text">{role}</span>
          </label>
        </div>
      ))}
    </fieldset>

    <p className="h-4 text-error text-xs mt-2 pl-1">
      {formMethods.formState.errors?.roles?.message}
    </p>

    <div className="divider text-sm font-semibold">
      {isNew ? 'Create' : 'Update'} password
    </div>

    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">
          {isNew ? 'Password' : 'New password'}
        </span>
      </label>
      <input
        type="password"
        id="password"
        placeholder={isNew ? 'Password' : 'New password'}
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.password?.message && 'input-error',
        )}
        {...formMethods.register('password')}
      />
    </div>

    <p className="h-4 text-error text-xs mt-2 pl-1">
      {formMethods.formState.errors?.password?.message}
    </p>

    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">
          {isNew ? 'Password confirmation' : 'New password confirmation'}
        </span>
      </label>
      <input
        type="password"
        id="passwordConfirmation"
        placeholder={
          isNew ? 'Password confirmation' : 'New password confirmation'
        }
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.passwordConfirmation?.message &&
            'input-error',
        )}
        {...formMethods.register('passwordConfirmation')}
      />
    </div>

    <p className="h-4 text-error text-xs mt-2 pl-1">
      {formMethods.formState.errors?.passwordConfirmation?.message}
    </p>

    <div className="mt-2 pl-1 h-8 flex items-center">
      {formError && <p className="text-error text-xs">{formError}</p>}
    </div>

    <ModalSubmitButton
      isDisabled={isSubmitDisabled}
      isSubmitting={isSubmitting}
      label={submitLabel}
    />
  </Form>
);
