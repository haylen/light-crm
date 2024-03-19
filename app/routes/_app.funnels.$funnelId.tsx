import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
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
import { FunnelForm } from '~/components/forms/FunnelForm';
import type { FormInput } from '~/schemas/funnel';
import { FunnelSchema } from '~/schemas/funnel';
import type { Country } from '~/utils/consts/countries';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

const formResolver = zodResolver(FunnelSchema);

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.UpdateFunnel]: async () => {
      try {
        const { receivedValues, errors, data } =
          await getValidatedFormData<FormInput>(request, formResolver);

        if (errors) {
          throw new Error('Form validation failed');
        }

        await db.funnel.update({
          where: { id: params.funnelId },
          data,
        });

        return redirect('/funnels');
      } catch (error) {
        return json({ formError: SOMETHING_WENT_WRONG }, 500);
      }
    },
  });
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const funnel = await db.funnel.findUniqueOrThrow({
      where: { id: params.funnelId },
    });

    return json({ funnel });
  } catch (error) {
    return redirect('/funnels');
  }
};

export const Route = () => {
  const actionData = useActionData<typeof action>();
  const { funnel } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const methods = useRemixForm<FormInput>({
    resolver: zodResolver(FunnelSchema),
    defaultValues: {
      name: funnel.name,
      websiteUrl: funnel.websiteUrl,
      country: funnel.country as Country,
      language: funnel.language ? (funnel.language as Country) : null,
    },
    submitConfig: {
      action: `?/${ActionType.UpdateFunnel}`,
    },
  });

  const handleCloseClick = () => navigate('/funnels');

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-lg">
          <ModalCloseButton onClose={handleCloseClick} />
          <h3 className="font-bold text-lg mb-4">View the funnel</h3>
          <FunnelForm
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
