import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
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
import { FunnelForm } from '~/components/FunnelForm';
import { Modal } from '~/components/Modal';
import type { FormInput } from '~/schemas/funnel';
import { FunnelSchema } from '~/schemas/funnel';
import { getSession } from '~/services/session.server';
import type { Country } from '~/utils/consts/countries';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
};

export const action = async ({ request, params }: ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  await verifyAuthenticityToken(request, session);

  return namedAction(request, {
    [ActionType.UpdateFunnel]: async () => {
      try {
        const form = await request.formData();
        const name = form.get('name');
        const websiteUrl = form.get('websiteUrl');
        const country = form.get('country');
        const language = form.get('language') || undefined;

        const parsedForm = FunnelSchema.parse({
          name,
          websiteUrl,
          country,
          language,
        });
        await db.funnel.update({
          where: { id: params.funnelId },
          data: {
            name: parsedForm.name,
            websiteUrl: parsedForm.websiteUrl,
            country: parsedForm.country,
            language: parsedForm.language || null,
          },
        });

        return redirect('/funnels');
      } catch (error) {
        return badRequest({
          formError: SOMETHING_WENT_WRONG,
        });
      }
    },
  });
};

export const loader = async ({ params }: LoaderArgs) => {
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
  const actionData = useActionData<ActionData>();
  const { funnel } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<FormInput>({
    resolver: zodResolver(FunnelSchema),
    defaultValues: {
      name: funnel.name,
      websiteUrl: funnel.websiteUrl,
      country: funnel.country as Country,
      language: funnel.language,
    },
  });

  const handleCloseClick = () => navigate('/funnels');

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
          <h3 className="font-bold text-lg mb-4">View the funnel</h3>
          <FunnelForm
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
