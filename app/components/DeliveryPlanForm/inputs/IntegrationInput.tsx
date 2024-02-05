import clsx from 'clsx';
import { type UseFormReturn } from 'react-hook-form';
import { FormInputError } from '~/components/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type IntegrationInputProps = {
  availableIntegrations: { id: string; name: string }[];
  formMethods: UseFormReturn<FormInput>;
};

export const IntegrationInput = ({
  availableIntegrations,
  formMethods,
}: IntegrationInputProps) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Integration</span>
      </label>
      <select
        id="brokerIntegrationId"
        className={clsx(
          'select select-bordered w-full text-base font-normal',
          formMethods.formState.errors?.brokerIntegrationId?.message &&
            'select-error',
        )}
        {...formMethods.register('brokerIntegrationId')}
      >
        <option value="">None</option>
        {availableIntegrations.map((integration) => (
          <option key={integration.id} value={integration.id}>
            {integration.name}
          </option>
        ))}
      </select>
    </div>

    <FormInputError>
      {formMethods.formState.errors?.brokerIntegrationId?.message}
    </FormInputError>
  </>
);
