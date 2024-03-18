import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { FormInputError } from '~/components/inputs/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type DailyCapInputProps = {
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
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
        {...formMethods.register('dailyCap', {
          setValueAs: (value) => Number(value),
        })}
      />
    </div>

    <FormInputError>
      {formMethods.formState.errors?.dailyCap?.message}
    </FormInputError>
  </>
);
