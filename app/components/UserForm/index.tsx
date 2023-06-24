import { Form } from '@remix-run/react';
import clsx from 'clsx';
import type { UseFormReturn } from 'react-hook-form';
import { AuthenticityTokenInput } from 'remix-utils';
import type { FormInput } from '~/schemas/user';
import { AVAILABLE_ROLES } from '~/utils/consts/users';

type UserFormProps = {
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  formError: string | undefined;
  formMethods: UseFormReturn<FormInput>;
  onSubmit: () => void;
};

export const UserForm = ({
  isSubmitDisabled,
  isSubmitting,
  submitLabel,
  formError,
  formMethods,
  onSubmit,
}: UserFormProps) => (
  <Form method="post" onSubmit={onSubmit}>
    <AuthenticityTokenInput />
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

    <div className="divider text-sm font-semibold">Change password</div>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">New password</span>
      </label>
      <input
        type="password"
        id="password"
        placeholder="New password"
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
        <span className="label-text">New password confirmation</span>
      </label>
      <input
        type="password"
        id="passwordConfirmation"
        placeholder="New password confirmation"
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
    <div className="modal-action">
      <button
        disabled={isSubmitDisabled}
        className={`btn btn-block ${isSubmitting ? 'loading' : ''}`}
      >
        {isSubmitting ? '' : submitLabel}
      </button>
    </div>
  </Form>
);
