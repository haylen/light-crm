import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { namedAction } from 'remix-utils/named-action';
import { Modal } from '~/components/Modal';
import { ModalCloseButton } from '~/components/ModalCloseButton';
import { BrokerForm } from '~/components/forms/BrokerForm';
import type { FormInput } from '~/schemas/broker';
import { BrokerSchema } from '~/schemas/broker';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

const formResolver = zodResolver(BrokerSchema);

export const loader = async () => {
  try {
    const users = await db.user.findMany({
      select: { id: true, email: true },
      orderBy: { createdAt: 'desc' },
    });

    return json({ users });
  } catch (error) {
    return redirect('/brokers');
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.CreateBroker]: async () => {
      try {
        const { errors, data } = await getValidatedFormData<FormInput>(
          request,
          formResolver,
        );

        if (errors) {
          throw new Error('Form validation failed');
        }

        await db.broker.create({ data });

        return redirect('/brokers');
      } catch (error) {
        return json({ formError: SOMETHING_WENT_WRONG }, 500);
      }
    },
  });
};

export const Route = () => {
  const actionData = useActionData<typeof action>();
  const { users } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useRemixForm<FormInput>({
    resolver: zodResolver(BrokerSchema),
    defaultValues: {
      name: '',
      managerId: undefined,
      managerPercentage: 0,
    },
    submitConfig: {
      action: `?/${ActionType.CreateBroker}`,
    },
  });

  const handleCloseClick = () => navigate('/brokers');

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-lg">
          <ModalCloseButton onClose={handleCloseClick} />
          <h3 className="font-bold text-lg mb-4">Create a new broker</h3>
          <BrokerForm
            submitLabel="Create"
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
