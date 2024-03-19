import { PaymentType } from '@prisma/client';
import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { FormInputError } from '~/components/inputs/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';
import { MAP_PAYMENT_TYPE_KEY_TO_LABEL } from '~/utils/consts/paymentTypes';

type PaymentTypeInputProps = {
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
};

export const PaymentTypeInput = ({ formMethods }: PaymentTypeInputProps) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Payment type</span>
      </label>
      <select
        id="paymentType"
        className={clsx(
          'select select-bordered w-full text-base font-normal',
          formMethods.formState.errors?.paymentType?.message && 'select-error',
        )}
        {...formMethods.register('paymentType')}
      >
        <option value="">None</option>
        {Object.values(PaymentType).map((value) => (
          <option key={value} value={value}>
            {MAP_PAYMENT_TYPE_KEY_TO_LABEL[value]}
          </option>
        ))}
      </select>
    </div>

    <FormInputError>
      {formMethods.formState.errors?.paymentType?.message}
    </FormInputError>
  </>
);
