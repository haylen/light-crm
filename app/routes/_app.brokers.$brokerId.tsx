import { zodResolver } from '@hookform/resolvers/zod';
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { namedAction } from 'remix-utils/named-action';
import { BrokerForm, EMPTY_MANAGER_SELECTION } from '~/components/BrokerForm';
import { Modal } from '~/components/Modal';
import type { FormInput } from '~/schemas/broker';
import { BrokerSchema } from '~/schemas/broker';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.UpdateBroker]: async () => {
      try {
        const form = await request.formData();
        const name = form.get('name');
        const managerId = form.get('managerId');
        const managerPercentage = Number(form.get('managerPercentage'));

        const parsedForm = BrokerSchema.parse({
          name,
          managerId:
            managerId === EMPTY_MANAGER_SELECTION ? undefined : managerId,
          managerPercentage,
        });
        await db.broker.update({
          where: { id: params.brokerId },
          data: {
            name: parsedForm.name,
            managerId: parsedForm.managerId || null,
            managerPercentage: parsedForm.managerPercentage,
          },
        });

        return redirect('/brokers');
      } catch (error) {
        return json({ formError: SOMETHING_WENT_WRONG }, 500);
      }
    },
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const broker = await db.broker.findUniqueOrThrow({
      where: { id: params.brokerId },
    });

    const users = await db.user.findMany({
      select: { id: true, email: true },
      orderBy: { createdAt: 'desc' },
    });

    return json({ broker, users });
  } catch (error) {
    return redirect('/brokers');
  }
};

export const Route = () => {
  const actionData = useActionData<ActionData>();
  const { broker, users } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<FormInput>({
    resolver: zodResolver(BrokerSchema),
    defaultValues: {
      name: broker.name,
      managerId: broker.managerId || EMPTY_MANAGER_SELECTION,
      managerPercentage: broker.managerPercentage || undefined,
    },
  });

  const handleCloseClick = () => navigate('/brokers');

  const handleSubmit: SubmitHandler<FormInput> = async (_data, event) => {
    if (event) submit(event.target, { replace: true });
  };

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-lg">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={handleCloseClick}
          >
            ✕
          </label>
          <h3 className="font-bold text-lg mb-4">View the broker</h3>
          <BrokerForm
            isSubmitDisabled={
              !methods.formState.isDirty ||
              !methods.formState.isValid ||
              ['submitting', 'loading'].includes(navigation.state)
            }
            isSubmitting={navigation.state === 'submitting'}
            formError={actionData?.formError}
            formMethods={methods}
            onSubmit={methods.handleSubmit(handleSubmit)}
            availableManagers={users}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Route;
