import { Form } from '@remix-run/react';
import clsx from 'clsx';
import type { UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import type { BrokerSchema } from '~/schemas/broker';

type FormInput = z.infer<typeof BrokerSchema>;

type BrokerFormProps = {
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  formError: string | undefined;
  formMethods: UseFormReturn<FormInput>;
  onSubmit: () => void;
};

export const BrokerForm = ({
  isSubmitDisabled,
  isSubmitting,
  submitLabel,
  formError,
  formMethods,
  onSubmit,
}: BrokerFormProps) => (
  <Form method="post" onSubmit={onSubmit}>
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
        {isSubmitting ? '' : submitLabel}
      </button>
    </div>
  </Form>
);
