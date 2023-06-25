import { Form } from '@remix-run/react';
import clsx from 'clsx';
import type { UseFormReturn } from 'react-hook-form';
import { AuthenticityTokenInput } from 'remix-utils';
import type { FormInput } from '~/schemas/broker';

type BrokerFormProps = {
  isNew?: boolean;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  formError: string | undefined;
  formMethods: UseFormReturn<FormInput>;
  onSubmit: () => void;
};

export const BrokerForm = ({
  isNew = false,
  isSubmitDisabled,
  isSubmitting,
  formError,
  formMethods,
  onSubmit,
}: BrokerFormProps) => (
  <Form method="post" onSubmit={onSubmit}>
    <AuthenticityTokenInput />
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Name</span>
      </label>
      <input
        type="text"
        id="name"
        placeholder="Name"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.name?.message && 'input-error',
        )}
        {...formMethods.register('name')}
      />
    </div>
    <p className="h-4 text-error text-xs mt-2 pl-1">
      {formMethods.formState.errors?.name?.message}
    </p>
    <div className="mt-2 pl-1 h-8 flex items-center">
      {formError && <p className="text-error text-xs">{formError}</p>}
    </div>
    <div className="modal-action">
      <button
        disabled={isSubmitDisabled}
        className={`btn btn-block ${isSubmitting ? 'loading' : ''}`}
      >
        {isSubmitting ? '' : isNew ? 'Create' : 'Update'}
      </button>
    </div>
  </Form>
);
