import clsx from 'clsx';
import { type UseFormReturn } from 'react-hook-form';
import { FormInputError } from '~/components/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type TotalCapInputProps = {
  formMethods: UseFormReturn<FormInput>;
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
        {...formMethods.register('totalCap')}
      />
    </div>

    <FormInputError>
      {formMethods.formState.errors?.totalCap?.message}
    </FormInputError>
  </>
);
