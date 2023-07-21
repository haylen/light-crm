import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@prisma/client';
import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { badRequest, namedAction, verifyAuthenticityToken } from 'remix-utils';
import { BrokerIntegrationForm } from '~/components/BrokerIntegrationForm';
import { Modal } from '~/components/Modal';
import type { FormInput } from '~/schemas/brokerIntegration';
import { BrokerIntegrationSchema } from '~/schemas/brokerIntegration';
import { getSession } from '~/services/session.server';
import {
  PRISMA_UNIQUENESS_CONSTRAINT_ERROR_CODE,
  SOMETHING_WENT_WRONG,
} from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
};

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  await verifyAuthenticityToken(request, session);

  return namedAction(request, {
    [ActionType.CreateBrokerIntegration]: async () => {
      try {
        const form = await request.formData();
        const name = form.get('name');

        const parsedForm = BrokerIntegrationSchema.parse({ name });
        await db.brokerIntegration.create({
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
          return badRequest({
            formError: 'An integration with this name already exists',
          });
        }

        return badRequest({
          formError: SOMETHING_WENT_WRONG,
        });
      }
    },
  });
};

export const Route = () => {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<FormInput>({
    resolver: zodResolver(BrokerIntegrationSchema),
    defaultValues: {
      name: '',
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
          <h3 className="font-bold text-lg mb-4">Create a new integration</h3>
          <BrokerIntegrationForm
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
          />
        </div>
      </div>
    </Modal>
  );
};

export default Route;
