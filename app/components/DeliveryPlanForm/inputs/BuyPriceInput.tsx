import clsx from 'clsx';
import { type UseFormReturn } from 'react-hook-form';
import { FormInputError } from '~/components/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type BuyPriceInputProps = {
  formMethods: UseFormReturn<FormInput>;
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
        {...formMethods.register('buyPrice')}
      />
    </div>

    <FormInputError>
      {formMethods.formState.errors?.buyPrice?.message}
    </FormInputError>
  </>
);
