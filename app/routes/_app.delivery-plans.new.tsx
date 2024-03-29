import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { namedAction } from 'remix-utils/named-action';
import { promiseHash } from 'remix-utils/promise';
import { Modal } from '~/components/Modal';
import { ModalCloseButton } from '~/components/ModalCloseButton';
import { DeliveryPlanForm } from '~/components/forms/DeliveryPlanForm';
import type { FormInput } from '~/schemas/deliveryPlan';
import { DeliveryPlanSchema } from '~/schemas/deliveryPlan';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { getCurrentTimezone } from '~/utils/dates';
import { db } from '~/utils/db.server';
import { parseTime } from '~/utils/parseDeliveryPlanWorkHoursTime';

const formResolver = zodResolver(DeliveryPlanSchema);

export const loader = async () => {
  try {
    return json(
      await promiseHash({
        brokers: db.broker.findMany({
          select: { id: true, name: true },
          orderBy: { createdAt: 'desc' },
        }),
        brokerIntegrations: db.brokerIntegration.findMany({
          select: { id: true, name: true },
          orderBy: { createdAt: 'desc' },
        }),
        funnels: db.funnel.findMany({
          select: { id: true, name: true },
          orderBy: { createdAt: 'desc' },
        }),
      }),
    );
  } catch (error) {
    return redirect('/delivery-plans');
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.CreateDeliveryPlan]: async () => {
      try {
        const { errors, data } = await getValidatedFormData<FormInput>(
          request,
          formResolver,
        );

        if (errors) {
          throw new Error('Form validation failed');
        }

        const dataToSave = {
          ...data,
          workHoursStart: parseTime(
            Boolean(data.isWorkHoursEnabled),
            data.workHoursStart,
          ),
          workHoursEnd: parseTime(
            Boolean(data.isWorkHoursEnabled),
            data.workHoursEnd,
          ),
          workHoursTimezone: data.isWorkHoursEnabled
            ? data.workHoursTimezone
            : undefined,
        };

        delete dataToSave.isWorkHoursEnabled;

        await db.deliveryPlan.create({ data: dataToSave });

        return redirect('/delivery-plans');
      } catch (error) {
        return json({ formError: SOMETHING_WENT_WRONG }, 500);
      }
    },
  });
};

export const Route = () => {
  const actionData = useActionData<typeof action>();
  const { brokers, brokerIntegrations, funnels } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const methods = useRemixForm<FormInput>({
    resolver: zodResolver(DeliveryPlanSchema),
    defaultValues: {
      name: '',
      brokerId: undefined,
      brokerIntegrationId: undefined,
      funnelId: undefined,
      buyPrice: undefined,
      sellPrice: undefined,
      dailyCap: undefined,
      totalCap: undefined,
      startDate: undefined,
      endDate: undefined,
      startEndDatesTimezone: getCurrentTimezone(),
      isWorkHoursEnabled: true,
      workHoursStart: '9:00',
      workHoursEnd: '17:00',
      workHoursTimezone: getCurrentTimezone(),
      paymentType: undefined,
    },
    submitConfig: {
      action: `?/${ActionType.CreateDeliveryPlan}`,
    },
  });

  const handleCloseClick = () => navigate('/delivery-plans');

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-4xl">
          <ModalCloseButton onClose={handleCloseClick} />
          <h3 className="font-bold text-lg mb-4">Create a new delivery plan</h3>
          <DeliveryPlanForm
            submitLabel="Create"
            isSubmitDisabled={
              !methods.formState.isDirty ||
              ['submitting', 'loading'].includes(navigation.state)
            }
            isSubmitting={navigation.state === 'submitting'}
            formError={actionData?.formError}
            formMethods={methods}
            onSubmit={methods.handleSubmit}
            availableBrokers={brokers}
            availableBrokerIntegrations={brokerIntegrations}
            availableFunnels={funnels}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Route;
