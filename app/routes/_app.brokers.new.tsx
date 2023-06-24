import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { verifyAuthenticityToken } from 'remix-utils';
import type { z } from 'zod';
import { BrokerForm } from '~/components/BrokerForm';
import { Modal } from '~/components/Modal';
import { BrokerSchema } from '~/schemas/broker';
import { getSession } from '~/services/session.server';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
};
type FormInput = z.infer<typeof BrokerSchema>;

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action = async ({ request }: ActionArgs) => {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    await verifyAuthenticityToken(request, session);

    const form = await request.formData();
    const name = form.get('name');

    const parsedForm = BrokerSchema.parse({ name });
    await db.broker.create({
      data: {
        name: parsedForm.name,
      },
    });
    return redirect('/brokers');
  } catch (error) {
    return badRequest({
      formError: SOMETHING_WENT_WRONG,
    });
  }
};

export const New = () => {
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<FormInput>({
    resolver: zodResolver(BrokerSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleCloseClick = () => {
    navigate('/brokers');
  };

  const handleSubmit: SubmitHandler<FormInput> = async (_data, event) => {
    if (!event) return;

    submit(event.target, { replace: true });
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
            isSubmitDisabled={
              (!methods.formState.isValid &&
                methods.formState.submitCount !== 0) ||
              ['submitting', 'loading'].includes(navigation.state)
            }
            isSubmitting={navigation.state === 'submitting'}
            submitLabel={'Create'}
            formError={actionData?.formError}
            formMethods={methods}
            onSubmit={methods.handleSubmit(handleSubmit)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default New;
