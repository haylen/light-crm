import clsx from 'clsx';
import { useRemixForm } from 'remix-hook-form';
import { FormInputError } from '~/components/inputs/FormInputError';
import { type FormInput } from '~/schemas/deliveryPlan';

type NameInputProps = {
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
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
