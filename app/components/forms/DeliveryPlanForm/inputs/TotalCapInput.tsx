import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { FormInputError } from '~/components/inputs/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type TotalCapInputProps = {
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
};

export const TotalCapInput = ({ formMethods }: TotalCapInputProps) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Total cap</span>
      </label>
      <input
        type="number"
        id="totalCap"
        placeholder="Total cap"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.totalCap?.message && 'input-error',
        )}
        {...formMethods.register('totalCap', {
          setValueAs: (value) => Number(value),
        })}
      />
    </div>

    <FormInputError>
      {formMethods.formState.errors?.totalCap?.message}
    </FormInputError>
  </>
);
