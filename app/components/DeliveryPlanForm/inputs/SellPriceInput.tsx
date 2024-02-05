import clsx from 'clsx';
import { type UseFormReturn } from 'react-hook-form';
import { FormInputError } from '~/components/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type SellPriceInputProps = {
  formMethods: UseFormReturn<FormInput>;
};

export const SellPriceInput = ({ formMethods }: SellPriceInputProps) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Sell price</span>
      </label>
      <input
        type="number"
        id="sellPrice"
        placeholder="Sell price $"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.sellPrice?.message && 'input-error',
        )}
        {...formMethods.register('sellPrice')}
      />
    </div>

    <FormInputError>
      {formMethods.formState.errors?.sellPrice?.message}
    </FormInputError>
  </>
);
