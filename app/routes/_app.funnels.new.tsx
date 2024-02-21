import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { namedAction } from 'remix-utils/named-action';
import { FunnelForm } from '~/components/FunnelForm';
import { Modal } from '~/components/Modal';
import { FunnelSchema } from '~/schemas/funnel';
import type { FormInput } from '~/schemas/funnel';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.CreateFunnel]: async () => {
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
        await db.funnel.create({
          data: {
            name: parsedForm.name,
            websiteUrl: parsedForm.websiteUrl,
            country: parsedForm.country,
            language: parsedForm.language,
          },
        });

        return redirect('/funnels');
      } catch (error) {
        return json({ formError: SOMETHING_WENT_WRONG }, 500);
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
    resolver: zodResolver(FunnelSchema),
    defaultValues: {
      name: '',
      websiteUrl: '',
      country: undefined,
      language: undefined,
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
          <h3 className="font-bold text-lg mb-4">Create a new funnel</h3>
          <FunnelForm
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
