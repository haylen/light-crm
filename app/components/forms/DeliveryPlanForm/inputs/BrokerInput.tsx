import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { FormInputError } from '~/components/inputs/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type BrokerInputProps = {
  availableBrokers: { id: string; name: string }[];
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
};

export const BrokerInput = ({
  availableBrokers,
  formMethods,
}: BrokerInputProps) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Broker</span>
      </label>
      <select
        id="brokerId"
        className={clsx(
          'select select-bordered w-full text-base font-normal',
          formMethods.formState.errors?.brokerId?.message && 'select-error',
        )}
        {...formMethods.register('brokerId')}
      >
        <option value="">None</option>
        {availableBrokers.map((broker) => (
          <option key={broker.id} value={broker.id}>
            {broker.name}
          </option>
        ))}
      </select>
    </div>

    <FormInputError>
      {formMethods.formState.errors?.brokerId?.message}
    </FormInputError>
  </>
);
