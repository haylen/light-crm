import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@prisma/client';
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
import { BrokerIntegrationForm } from '~/components/BrokerIntegrationForm';
import { Modal } from '~/components/Modal';
import type { FormInput } from '~/schemas/brokerIntegration';
import { BrokerIntegrationSchema } from '~/schemas/brokerIntegration';
import {
  PRISMA_UNIQUENESS_CONSTRAINT_ERROR_CODE,
  SOMETHING_WENT_WRONG,
} from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.UpdateBrokerIntegration]: async () => {
      try {
        const form = await request.formData();
        const name = form.get('name');

        const parsedForm = BrokerIntegrationSchema.parse({ name });
        await db.brokerIntegration.update({
          where: { id: params.brokerIntegrationId },
          data: {
            name: parsedForm.name,
          },
        });

        return redirect('/broker-integrations');
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === PRISMA_UNIQUENESS_CONSTRAINT_ERROR_CODE
        ) {
          return json(
            { formError: 'An integration with this name already exists' },
            409,
          );
        }

        return json({ formError: SOMETHING_WENT_WRONG }, 500);
      }
    },
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const brokerIntegration = await db.brokerIntegration.findUniqueOrThrow({
      where: { id: params.brokerIntegrationId },
    });

    return json({ brokerIntegration });
  } catch (error) {
    return redirect('/broker-integrations');
  }
};

export const Route = () => {
  const actionData = useActionData<ActionData>();
  const { brokerIntegration } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<FormInput>({
    resolver: zodResolver(BrokerIntegrationSchema),
    defaultValues: {
      name: brokerIntegration.name,
    },
  });

  const handleCloseClick = () => navigate('/broker-integrations');

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
          <h3 className="font-bold text-lg mb-4">View the integration</h3>
          <BrokerIntegrationForm
            isSubmitDisabled={
              !methods.formState.isDirty ||
              !methods.formState.isValid ||
              ['submitting', 'loading'].includes(navigation.state)
            }
            isSubmitting={navigation.state === 'submitting'}
            formError={actionData?.formError}
            formMethods={methods}
            onSubmit={methods.handleSubmit(handleSubmit)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Route;
