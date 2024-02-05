import clsx from 'clsx';
import { type UseFormReturn } from 'react-hook-form';
import { FormInputError } from '~/components/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type NameInputProps = {
  formMethods: UseFormReturn<FormInput>;
};

export const NameInput = ({ formMethods }: NameInputProps) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Name</span>
      </label>
      <input
        type="text"
        placeholder="Name"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.name?.message && 'input-error',
        )}
        {...formMethods.register('name')}
      />
    </div>

    <FormInputError>
      {formMethods.formState.errors?.name?.message}
    </FormInputError>
  </>
);
