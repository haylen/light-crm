import { Form } from '@remix-run/react';
import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { ModalSubmitButton } from '~/components/ModalSubmitButton';
import { type FormInput } from '~/schemas/broker';

type BrokerFormProps = {
  submitLabel: string;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  formError: string | undefined;
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
  onSubmit: () => void;
  availableManagers: { id: string; email: string }[];
};

export const BrokerForm = ({
  submitLabel,
  isSubmitDisabled,
  isSubmitting,
  formError,
  formMethods,
  onSubmit,
  availableManagers,
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

    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Manager % (0% - 100%) </span>
      </label>
      <input
        type="number"
        step="0.01"
        id="managerPercentage"
        placeholder="Manager %"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.managerPercentage?.message &&
            'input-error',
        )}
        {...formMethods.register('managerPercentage', {
          setValueAs: (value) => Number(value),
        })}
      />
    </div>

    <p className="h-4 text-error text-xs mt-2 pl-1">
      {formMethods.formState.errors?.managerPercentage?.message}
    </p>

    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Manager</span>
      </label>
      <select
        id="managerId"
        className="select select-bordered w-full text-base font-normal"
        {...formMethods.register('managerId', {
          setValueAs: (value) => value || null,
        })}
      >
        <option value="">None</option>
        {availableManagers.map((manager) => (
          <option key={manager.id} value={manager.id}>
            {manager.email}
          </option>
        ))}
      </select>
    </div>

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
