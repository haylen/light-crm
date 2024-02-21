import { Form } from '@remix-run/react';
import clsx from 'clsx';
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { CountryAutocompleteDropdown } from '~/components/CountryAutocompleteDropdown';
import type { FormInput } from '~/schemas/funnel';
import { ActionType } from '~/utils/consts/formActions';

type FunnelFormProps = {
  isNew?: boolean;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  formError: string | undefined;
  formMethods: UseFormReturn<FormInput>;
  onSubmit: () => void;
};

export const FunnelForm = ({
  isNew = false,
  isSubmitDisabled,
  isSubmitting,
  formError,
  formMethods,
  onSubmit,
}: FunnelFormProps) => (
  <Form
    method="post"
    action={`?/${isNew ? ActionType.CreateFunnel : ActionType.UpdateFunnel}`}
    onSubmit={onSubmit}
  >
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Name</span>
      </label>
      <input
        type="text"
        id="name"
        placeholder="Name"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.name?.message && 'input-error',
        )}
        {...formMethods.register('name')}
      />
    </div>

    <p className="h-4 text-error text-xs mt-2 pl-1">
      {formMethods.formState.errors?.name?.message}
    </p>

    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">Website URL</span>
      </label>
      <input
        type="text"
        id="websiteUrl"
        placeholder="example.com"
        className={clsx(
          'input input-bordered w-full',
          formMethods.formState.errors?.websiteUrl?.message && 'input-error',
        )}
        {...formMethods.register('websiteUrl')}
      />
    </div>

    <p className="h-4 text-error text-xs mt-2 pl-1">
      {formMethods.formState.errors?.websiteUrl?.message}
    </p>

    <Controller
      name="country"
      control={formMethods.control}
      render={({ field, fieldState }) => (
        <CountryAutocompleteDropdown
          label="Country"
          placeholder="Choose a country code"
          inputName={field.name}
          selectedItem={field.value}
          errorMessage={fieldState.error?.message}
          onChange={(selectedItem: string | undefined) =>
            field.onChange(selectedItem)
          }
        />
      )}
    />

    <div className="mb-40">
      <Controller
        name="language"
        control={formMethods.control}
        render={({ field, fieldState }) => (
          <CountryAutocompleteDropdown
            label="Language (optional)"
            placeholder="Choose a country code"
            inputName={field.name}
            selectedItem={field.value}
            errorMessage={fieldState.error?.message}
            onChange={(selectedItem: string | undefined) =>
              field.onChange(selectedItem)
            }
          />
        )}
      />
    </div>

    <div className="pl-1 h-8 flex items-center">
      {formError && <p className="text-error text-xs">{formError}</p>}
    </div>

    <div className="modal-action">
      <button
        disabled={isSubmitDisabled}
        className={`btn btn-block ${isSubmitting ? 'loading' : ''}`}
      >
        {isSubmitting ? '' : isNew ? 'Create' : 'Update'}
      </button>
    </div>
  </Form>
);
