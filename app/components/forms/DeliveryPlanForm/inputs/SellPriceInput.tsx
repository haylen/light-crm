import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { FormInputError } from '~/components/inputs/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type SellPriceInputProps = {
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
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
        {...formMethods.register('sellPrice', {
          setValueAs: (value) => Number(value),
        })}
      />
    </div>

    <FormInputError>
      {formMethods.formState.errors?.sellPrice?.message}
    </FormInputError>
  </>
);
