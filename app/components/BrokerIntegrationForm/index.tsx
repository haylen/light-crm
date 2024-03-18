import { Form } from '@remix-run/react';
import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { ModalSubmitButton } from '~/components//ModalSubmitButton';
import type { FormInput } from '~/schemas/brokerIntegration';

type BrokerIntegrationFormProps = {
  submitLabel: string;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  formError: string | undefined;
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
  onSubmit: () => void;
};

export const BrokerIntegrationForm = ({
  submitLabel,
  isSubmitDisabled,
  isSubmitting,
  formError,
  formMethods,
  onSubmit,
}: BrokerIntegrationFormProps) => (
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

    <ModalSubmitButton
      isDisabled={isSubmitDisabled}
      isSubmitting={isSubmitting}
      label={submitLabel}
    />
  </Form>
);
