import { Form } from '@remix-run/react';
import { useRemixForm } from 'remix-hook-form';
import { ModalSubmitButton } from '~/components/ModalSubmitButton';
import { CurrentTimezoneLabel } from '~/components/forms/DeliveryPlanForm/CurrentTimezoneLabel';
import { BrokerInput } from '~/components/forms/DeliveryPlanForm/inputs/BrokerInput';
import { BuyPriceInput } from '~/components/forms/DeliveryPlanForm/inputs/BuyPriceInput';
import { DailyCapInput } from '~/components/forms/DeliveryPlanForm/inputs/DailyCapInput';
import { DeliveryDateInputs } from '~/components/forms/DeliveryPlanForm/inputs/DeliveryDateInputs';
import { FunnelInput } from '~/components/forms/DeliveryPlanForm/inputs/FunnelInput';
import { IntegrationInput } from '~/components/forms/DeliveryPlanForm/inputs/IntegrationInput';
import { NameInput } from '~/components/forms/DeliveryPlanForm/inputs/NameInput';
import { PaymentTypeInput } from '~/components/forms/DeliveryPlanForm/inputs/PaymentTypeInput';
import { SellPriceInput } from '~/components/forms/DeliveryPlanForm/inputs/SellPriceInput';
import { TotalCapInput } from '~/components/forms/DeliveryPlanForm/inputs/TotalCapInput';
import { WorkingTimeInputs } from '~/components/forms/DeliveryPlanForm/inputs/WorkingTimeInputs';
import { type FormInput } from '~/schemas/deliveryPlan';
import { ActionType } from '~/utils/consts/formActions';

type DeliveryPlanFormProps = {
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  formError: string | undefined;
  formMethods: ReturnType<typeof useRemixForm<FormInput>>;
  onSubmit: () => void;
  availableBrokers: { id: string; name: string }[];
  availableBrokerIntegrations: { id: string; name: string }[];
  availableFunnels: { id: string; name: string }[];
};

export const DeliveryPlanForm = ({
  isSubmitDisabled,
  isSubmitting,
  submitLabel,
  formError,
  formMethods,
  onSubmit,
  availableBrokers,
  availableBrokerIntegrations,
  availableFunnels,
}: DeliveryPlanFormProps) => (
  <Form
    onSubmit={onSubmit}
    method="post"
    action={`?/${ActionType.CreateDeliveryPlan}`}
  >
    <NameInput formMethods={formMethods} />

    <div className="flex max-md:flex-col">
      <div className="basis-1/2 pr-4 max-md:pr-0">
        <BrokerInput
          availableBrokers={availableBrokers}
          formMethods={formMethods}
        />
      </div>
      <div className="basis-1/2 pl-4 max-md:pl-0">
        <IntegrationInput
          availableIntegrations={availableBrokerIntegrations}
          formMethods={formMethods}
        />
      </div>
    </div>

    <div className="flex max-md:flex-col">
      <div className="basis-1/2 pr-4 max-md:pr-0">
        <FunnelInput
          availableFunnels={availableFunnels}
          formMethods={formMethods}
        />
      </div>
      <div className="basis-1/2 pl-4 max-md:pl-0">
        <PaymentTypeInput formMethods={formMethods} />
      </div>
    </div>

    <div className="flex flex-row-reverse">
      <CurrentTimezoneLabel />
    </div>

    <WorkingTimeInputs formMethods={formMethods} />
    <DeliveryDateInputs formMethods={formMethods} />

    <div className="divider text-sm font-semibold">Pricing</div>

    <div className="flex max-sm:flex-col">
      <div className="basis-1/2 pr-4 max-sm:pr-0">
        <BuyPriceInput formMethods={formMethods} />
      </div>
      <div className="basis-1/2 pl-4 max-sm:pl-0">
        <SellPriceInput formMethods={formMethods} />
      </div>
    </div>

    <div className="flex max-sm:flex-col">
      <div className="basis-1/2 pr-4 max-sm:pr-0">
        <DailyCapInput formMethods={formMethods} />
      </div>
      <div className="basis-1/2 pl-4 max-sm:pl-0">
        <TotalCapInput formMethods={formMethods} />
      </div>
    </div>

    <div className="mt-2 pl-1 h-8 flex items-center">
      {formError && <p className="text-error text-xs">{formError}</p>}
    </div>

    <ModalSubmitButton
      isDisabled={isSubmitDisabled}
      isSubmitting={isSubmitting}
      label={submitLabel}
    />
  </Form>
);
