import { Controller, type UseFormReturn } from 'react-hook-form';
import { Datepicker } from '~/components/Datepicker';
import { FormInputError } from '~/components/FormInputError';
import { TimezoneInput } from '~/components/inputs/TimezoneInput';
import { type FormInput } from '~/schemas/deliveryPlan';

type DeliveryDateInputsProps = {
  formMethods: UseFormReturn<FormInput>;
};

export const DeliveryDateInputs = ({
  formMethods,
}: DeliveryDateInputsProps) => (
  <>
    <div className="divider text-sm font-semibold">Delivery dates</div>

    <div className="flex gap-4 max-lg:flex-col max-lg:gap-0">
      <div className="w-72">
        <div className="relative form-control w-full">
          <label className="label">
            <span className="label-text">Start date</span>
          </label>
          <Controller
            name="startDate"
            control={formMethods.control}
            render={({ field }) => (
              <Datepicker
                name={field.name}
                value={field.value}
                onChange={(event) => {
                  field.onChange(event);
                  formMethods.trigger('endDate');
                }}
                classNames="top-22"
              />
            )}
          />
        </div>
        <FormInputError>
          {formMethods.formState.errors?.startDate?.message}
        </FormInputError>
      </div>

      <div className="flex max-sm:flex-wrap">
        <div className="w-72 mr-4">
          <div className="relative form-control w-full">
            <label className="label">
              <span className="label-text">End date</span>
            </label>
            <Controller
              name="endDate"
              control={formMethods.control}
              render={({ field }) => (
                <Datepicker
                  name={field.name}
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event);
                    formMethods.trigger('startDate');
                  }}
                  classNames="top-22"
                />
              )}
            />
          </div>
          <FormInputError>
            {formMethods.formState.errors?.endDate?.message}
          </FormInputError>
        </div>

        <div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Timezone</span>
            </label>
            <Controller
              name="startEndDatesTimezone"
              control={formMethods.control}
              render={({ field }) => (
                <TimezoneInput
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  </>
);
