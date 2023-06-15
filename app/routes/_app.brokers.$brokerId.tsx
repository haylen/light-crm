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
import type { z } from 'zod';
import { BrokerForm } from '~/components/BrokerForm';
import { Modal } from '~/components/Modal';
import { BrokerSchema } from '~/schemas/broker';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
  };
};

type FormInput = z.infer<typeof BrokerSchema>;

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const name = form.get('name');

  try {
    const parsedForm = BrokerSchema.parse({ name });

    await db.broker.update({
      where: { id: params.brokerId },
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

export const loader = async ({ params }: LoaderArgs) => {
  try {
    const broker = await db.broker.findUniqueOrThrow({
      where: { id: params.brokerId },
    });

    return json({ broker });
  } catch (error) {
    return redirect('/brokers');
  }
};

export const BrokerView = () => {
  const actionData = useActionData<ActionData>();
  const { broker } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<FormInput>({
    resolver: zodResolver(BrokerSchema),
    defaultValues: {
      name: broker.name,
    },
  });

  const handleCloseClick = () => navigate('/brokers');

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
          <h3 className="font-bold text-lg mb-4">View the broker</h3>
          <BrokerForm
            isSubmitDisabled={
              !methods.formState.isDirty ||
              !methods.formState.isValid ||
              ['submitting', 'loading'].includes(navigation.state)
            }
            isSubmitting={navigation.state === 'submitting'}
            submitLabel={'Update'}
            formError={actionData?.formError}
            formMethods={methods}
            onSubmit={methods.handleSubmit(handleSubmit)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default BrokerView;
