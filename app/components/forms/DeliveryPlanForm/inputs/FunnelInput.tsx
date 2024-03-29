import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { FormInputError } from '~/components/inputs/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type FunnelInputProps = {
  availableFunnels: { id: string; name: string }[];
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
};

export const FunnelInput = ({
  availableFunnels,
  formMethods,
}: FunnelInputProps) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Funnel</span>
      </label>
      <select
        id="funnelId"
        className={clsx(
          'select select-bordered w-full text-base font-normal',
          formMethods.formState.errors?.funnelId?.message && 'select-error',
        )}
        {...formMethods.register('funnelId', {
          setValueAs: (value) => value || null,
        })}
      >
        <option value="">None</option>
        {availableFunnels.map((funnel) => (
          <option key={funnel.id} value={funnel.id}>
            {funnel.name}
          </option>
        ))}
      </select>
    </div>

    <FormInputError>
      {formMethods.formState.errors?.funnelId?.message}
    </FormInputError>
  </>
);
