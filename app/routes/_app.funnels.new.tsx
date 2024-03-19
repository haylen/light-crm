import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@prisma/client';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useNavigate, useNavigation } from '@remix-run/react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { namedAction } from 'remix-utils/named-action';
import { Modal } from '~/components/Modal';
import { ModalCloseButton } from '~/components/ModalCloseButton';
import { FunnelForm } from '~/components/forms/FunnelForm';
import { FunnelSchema } from '~/schemas/funnel';
import type { FormInput } from '~/schemas/funnel';
import {
  PRISMA_UNIQUENESS_CONSTRAINT_ERROR_CODE,
  SOMETHING_WENT_WRONG,
} from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

const formResolver = zodResolver(FunnelSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.CreateFunnel]: async () => {
      try {
        const { errors, data } = await getValidatedFormData<FormInput>(
          request,
          formResolver,
        );

        if (errors) {
          throw new Error('Form validation failed');
        }

        await db.funnel.create({ data });

        return redirect('/funnels');
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === PRISMA_UNIQUENESS_CONSTRAINT_ERROR_CODE
        ) {
          return json(
            { formError: 'A funnel with this name already exists' },
            409,
          );
        }

        return json({ formError: SOMETHING_WENT_WRONG }, 500);
      }
    },
  });
};

export const Route = () => {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const methods = useRemixForm<FormInput>({
    resolver: zodResolver(FunnelSchema),
    defaultValues: {
      name: '',
      websiteUrl: '',
      country: undefined,
      /* Having language as undefined leads to receiving the value as "undefined" string on the server */
      language: null,
    },
    submitConfig: {
      action: `?/${ActionType.CreateFunnel}`,
    },
  });

  const handleCloseClick = () => navigate('/funnels');

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-lg">
          <ModalCloseButton onClose={handleCloseClick} />
          <h3 className="font-bold text-lg mb-4">Create a new funnel</h3>
          <FunnelForm
            submitLabel="Create"
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
