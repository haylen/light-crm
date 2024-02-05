import clsx from 'clsx';
import { type UseFormReturn } from 'react-hook-form';
import { FormInputError } from '~/components/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type DailyCapInputProps = {
  formMethods: UseFormReturn<FormInput>;
};

export const DailyCapInput = ({ formMethods }: DailyCapInputProps) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Daily cap</span>
      </label>
      <input
        type="number"
        id="dailyCap"
        placeholder="Daily cap"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.dailyCap?.message && 'input-error',
        )}
        {...formMethods.register('dailyCap')}
      />
    </div>

    <FormInputError>
      {formMethods.formState.errors?.dailyCap?.message}
    </FormInputError>
  </>
);
