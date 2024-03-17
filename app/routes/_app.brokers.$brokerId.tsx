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
} from '@remix-run/react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { namedAction } from 'remix-utils/named-action';
import { promiseHash } from 'remix-utils/promise';
import { Modal } from '~/components/Modal';
import { ModalCloseButton } from '~/components/ModalCloseButton';
import { BrokerForm } from '~/components/forms/BrokerForm';
import { type FormInput } from '~/schemas/broker';
import { BrokerSchema } from '~/schemas/broker';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

const formResolver = zodResolver(BrokerSchema);

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.UpdateBroker]: async () => {
      try {
        const { errors, data } = await getValidatedFormData<FormInput>(
          request,
          formResolver,
        );

        if (errors) {
          throw new Error('Form validation failed');
        }

        await db.broker.update({
          where: { id: params.brokerId },
          data: data,
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
    return json(
      await promiseHash({
        broker: db.broker.findUniqueOrThrow({
          where: { id: params.brokerId },
        }),
        users: db.user.findMany({
          select: { id: true, email: true },
          orderBy: { createdAt: 'desc' },
        }),
      }),
    );
  } catch (error) {
    return redirect('/brokers');
  }
};

export const Route = () => {
  const actionData = useActionData<typeof action>();
  const { broker, users } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const methods = useRemixForm<FormInput>({
    resolver: formResolver,
    defaultValues: {
      name: broker.name,
      managerId: broker.managerId,
      managerPercentage: broker.managerPercentage,
    },
    submitConfig: {
      action: `?/${ActionType.UpdateBroker}`,
    },
  });

  const handleCloseClick = () => navigate('/brokers');

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-lg">
          <ModalCloseButton onClose={handleCloseClick} />
          <h3 className="font-bold text-lg mb-4">View the broker</h3>
          <BrokerForm
            submitLabel="Update"
            isSubmitDisabled={
              !methods.formState.isDirty ||
              ['submitting', 'loading'].includes(navigation.state)
            }
            isSubmitting={navigation.state === 'submitting'}
            formError={actionData?.formError}
            formMethods={methods}
            onSubmit={methods.handleSubmit}
            availableManagers={users}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Route;
