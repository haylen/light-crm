import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { badRequest, namedAction, verifyAuthenticityToken } from 'remix-utils';
import { DeliveryPlanForm } from '~/components/DeliveryPlanForm';
import { Modal } from '~/components/Modal';
import type { FormInput } from '~/schemas/deliveryPlan';
import { DeliveryPlanSchema } from '~/schemas/deliveryPlan';
import { getSession } from '~/services/session.server';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { getCurrentTimezone } from '~/utils/dates';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
};

const parseTime = (isWorkHoursEnabled: boolean, time?: string) => {
  if (!isWorkHoursEnabled || !time) return undefined;
  const [hours, minutes] = time.split(':');
  return new Date(Date.UTC(2000, 0, 1, +hours, +minutes));
};

export const loader = async () => {
  try {
    const brokers = await db.broker.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
    });
    const brokerIntegrations = await db.brokerIntegration.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
    });
    const funnels = await db.funnel.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
    });

    return json({ brokers, brokerIntegrations, funnels });
  } catch (error) {
    return redirect('/delivery-plans');
  }
};

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  await verifyAuthenticityToken(request, session);

  return namedAction(request, {
    [ActionType.CreateDeliveryPlan]: async () => {
      try {
        const form = await request.formData();
        const formDataObj = Object.fromEntries(form.entries());
        const parsedForm = DeliveryPlanSchema.parse(formDataObj);

        const dataToSave = {
          ...parsedForm,
          workHoursStart: parseTime(
            Boolean(parsedForm.isWorkHoursEnabled),
            parsedForm.workHoursStart,
          ),
          workHoursEnd: parseTime(
            Boolean(parsedForm.isWorkHoursEnabled),
            parsedForm.workHoursEnd,
          ),
          workHoursTimezone: parsedForm.isWorkHoursEnabled
            ? parsedForm.workHoursTimezone
            : undefined,
        };

        delete dataToSave.isWorkHoursEnabled;

        await db.deliveryPlan.create({
          data: {
            ...dataToSave,
          },
        });

        return redirect('/delivery-plans');
      } catch (error) {
        return badRequest({
          formError: SOMETHING_WENT_WRONG,
        });
      }
    },
  });
};

export const Route = () => {
  const actionData = useActionData<ActionData>();
  const { brokers, brokerIntegrations, funnels } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<FormInput>({
    resolver: zodResolver(DeliveryPlanSchema),
    mode: 'all',
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
  });

  const handleCloseClick = () => navigate('/delivery-plans');

  const handleSubmit: SubmitHandler<FormInput> = async (
    data: FormInput,
    event,
  ) => {
    if (event) submit(event.target, { replace: true });
  };

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-4xl">
          <label
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={handleCloseClick}
          >
            ✕
          </label>
          <h3 className="font-bold text-lg mb-4">Create a new delivery plan</h3>
          <DeliveryPlanForm
            submitLabel="Create"
            isSubmitDisabled={['submitting', 'loading'].includes(
              navigation.state,
            )}
            isSubmitting={navigation.state === 'submitting'}
            formError={actionData?.formError}
            formMethods={methods}
            onSubmit={methods.handleSubmit(handleSubmit)}
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
