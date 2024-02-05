import { Form } from '@remix-run/react';
import { type UseFormReturn } from 'react-hook-form';
import { AuthenticityTokenInput } from 'remix-utils';
import { CurrentTimezoneLabel } from '~/components/DeliveryPlanForm/CurrentTimezoneLabel';
import { BrokerInput } from '~/components/DeliveryPlanForm/inputs/BrokerInput';
import { BuyPriceInput } from '~/components/DeliveryPlanForm/inputs/BuyPriceInput';
import { DailyCapInput } from '~/components/DeliveryPlanForm/inputs/DailyCapInput';
import { DeliveryDateInputs } from '~/components/DeliveryPlanForm/inputs/DeliveryDateInputs';
import { FunnelInput } from '~/components/DeliveryPlanForm/inputs/FunnelInput';
import { IntegrationInput } from '~/components/DeliveryPlanForm/inputs/IntegrationInput';
import { NameInput } from '~/components/DeliveryPlanForm/inputs/NameInput';
import { PaymentTypeInput } from '~/components/DeliveryPlanForm/inputs/PaymentTypeInput';
import { SellPriceInput } from '~/components/DeliveryPlanForm/inputs/SellPriceInput';
import { TotalCapInput } from '~/components/DeliveryPlanForm/inputs/TotalCapInput';
import { WorkingTimeInputs } from '~/components/DeliveryPlanForm/inputs/WorkingTimeInputs';
import { ModalSubmitButton } from '~/components/ModalSubmitButton';
import { type FormInput } from '~/schemas/deliveryPlan';
import { ActionType } from '~/utils/consts/formActions';

type DeliveryPlanFormProps = {
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  formError: string | undefined;
  formMethods: UseFormReturn<FormInput>;
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
    <AuthenticityTokenInput />

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
