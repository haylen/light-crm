import { PaymentType } from '@prisma/client';
import clsx from 'clsx';
import { type UseFormReturn } from 'react-hook-form';
import { FormInputError } from '~/components/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

const MAP_PAYMENT_TYPE_KEY_TO_LABEL = {
  [PaymentType.Cpa]: 'CPA',
  [PaymentType.Cpl]: 'CPL',
  [PaymentType.CpaCrg]: 'CPA - CRG',
};

type PaymentTypeInputProps = {
  formMethods: UseFormReturn<FormInput>;
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
