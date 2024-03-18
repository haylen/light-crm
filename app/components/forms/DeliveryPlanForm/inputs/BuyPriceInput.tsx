import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { FormInputError } from '~/components/inputs/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type BuyPriceInputProps = {
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
};

export const BuyPriceInput = ({ formMethods }: BuyPriceInputProps) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Buy price</span>
      </label>
      <input
        type="number"
        id="buyPrice"
        placeholder="Buy price $"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.buyPrice?.message && 'input-error',
        )}
        {...formMethods.register('buyPrice', {
          setValueAs: (value) => Number(value),
        })}
      />
    </div>

    <FormInputError>
      {formMethods.formState.errors?.buyPrice?.message}
    </FormInputError>
  </>
);
