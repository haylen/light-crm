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
} from '@remix-run/react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { namedAction } from 'remix-utils/named-action';
import { Modal } from '~/components/Modal';
import { ModalCloseButton } from '~/components/ModalCloseButton';
import { BrokerIntegrationForm } from '~/components/forms/BrokerIntegrationForm';
import type { FormInput } from '~/schemas/brokerIntegration';
import { BrokerIntegrationSchema } from '~/schemas/brokerIntegration';
import {
  PRISMA_UNIQUENESS_CONSTRAINT_ERROR_CODE,
  SOMETHING_WENT_WRONG,
} from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

const formResolver = zodResolver(BrokerIntegrationSchema);

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.UpdateBrokerIntegration]: async () => {
      try {
        const { errors, data } = await getValidatedFormData<FormInput>(
          request,
          formResolver,
        );

        if (errors) {
          throw new Error('Form validation failed');
        }

        await db.brokerIntegration.update({
          where: { id: params.brokerIntegrationId },
          data,
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
  const actionData = useActionData<typeof action>();
  const { brokerIntegration } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const methods = useRemixForm<FormInput>({
    resolver: zodResolver(BrokerIntegrationSchema),
    defaultValues: {
      name: brokerIntegration.name,
    },
    submitConfig: {
      action: `?/${ActionType.UpdateBrokerIntegration}`,
    },
  });

  const handleCloseClick = () => navigate('/broker-integrations');

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-lg">
          <ModalCloseButton onClose={handleCloseClick} />
          <h3 className="font-bold text-lg mb-4">View the integration</h3>
          <BrokerIntegrationForm
            submitLabel="Update"
            isSubmitDisabled={
              !methods.formState.isDirty ||
              ['submitting', 'loading'].includes(navigation.state)
            }
            isSubmitting={navigation.state === 'submitting'}
            formError={actionData?.formError}
            formMethods={methods}
            onSubmit={methods.handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Route;
