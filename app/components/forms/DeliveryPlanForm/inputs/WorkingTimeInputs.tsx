import { Controller } from 'react-hook-form';
import { useRemixForm } from 'remix-hook-form';
import { FormInputError } from '~/components/FormInputError';
import { TimeInput } from '~/components/inputs/TimeInput';
import { TimezoneInput } from '~/components/inputs/TimezoneInput';
import { type FormInput } from '~/schemas/deliveryPlan';

type WorkingTimeInputsProps = {
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
};

export const WorkingTimeInputs = ({ formMethods }: WorkingTimeInputsProps) => {
  const isWorkingHoursEnabled = formMethods.watch('isWorkHoursEnabled', false);

  return (
    <>
      <div className="divider h-auto">
        <Controller
          name="isWorkHoursEnabled"
          control={formMethods.control}
          render={({ field }) => (
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4">
                <input
                  type="checkbox"
                  name={field.name}
                  value={`${field.value}`}
                  checked={field.value}
                  className="toggle"
                  onChange={(event) => {
                    field.onChange(event);
                  }}
                />
                <span className="label-text text-sm font-semibold">
                  Delivery time
                </span>
              </label>
            </div>
          )}
        />
      </div>

      <div className="flex gap-4 max-lg:flex-col max-lg:gap-0">
        <div className="form-control w-72">
          <label className="label">
            <span className="label-text">Work hours (Start)</span>
          </label>
          <Controller
            name="workHoursStart"
            control={formMethods.control}
            render={({ field }) => (
              <TimeInput
                name={field.name}
                value={field.value}
                onChange={(event) => {
                  field.onChange(event);
                  formMethods.trigger('isWorkHoursEnabled');
                }}
                isDisabled={!isWorkingHoursEnabled}
              />
            )}
          />
        </div>

        <div className="flex max-sm:flex-wrap">
          <div className="form-control w-72 mr-4">
            <label className="label">
              <span className="label-text">Work hours (End)</span>
            </label>
            <Controller
              name="workHoursEnd"
              control={formMethods.control}
              render={({ field }) => (
                <TimeInput
                  name={field.name}
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event);
                    formMethods.trigger('isWorkHoursEnabled');
                  }}
                  isDisabled={!isWorkingHoursEnabled}
                />
              )}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Timezone</span>
            </label>
            <Controller
              name="workHoursTimezone"
              control={formMethods.control}
              render={({ field }) => (
                <TimezoneInput
                  name={field.name}
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event);
                    formMethods.trigger('isWorkHoursEnabled');
                  }}
                  isDisabled={!isWorkingHoursEnabled}
                />
              )}
            />
          </div>
        </div>
      </div>

      <FormInputError>
        {formMethods.formState.errors?.isWorkHoursEnabled?.message}
      </FormInputError>
    </>
  );
};
