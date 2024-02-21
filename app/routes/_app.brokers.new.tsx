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
        const form = await request.formData();
        const name = form.get('name');
        const managerId = form.get('managerId');
        const managerPercentage = form.get('managerPercentage');

        const parsedForm = BrokerSchema.parse({
          name,
          managerId:
            managerId === EMPTY_MANAGER_SELECTION ? undefined : managerId,
          managerPercentage,
        });
        await db.broker.create({
          data: {
            name: parsedForm.name,
            managerId: parsedForm.managerId,
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

export const Route = () => {
  const actionData = useActionData<ActionData>();
  const { users } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<FormInput>({
    resolver: zodResolver(BrokerSchema),
    defaultValues: {
      name: '',
      managerId: undefined,
      managerPercentage: undefined,
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
          <h3 className="font-bold text-lg mb-4">Create a new broker</h3>
          <BrokerForm
            isNew
            isSubmitDisabled={
              (!methods.formState.isValid &&
                methods.formState.submitCount !== 0) ||
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
