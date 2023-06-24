import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@prisma/client';
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
import { Modal } from '~/components/Modal';
import { UserForm } from '~/components/UserForm';
import type { FormInput } from '~/schemas/user';
import { CreateUserSchema } from '~/schemas/user';
import { hashPassword } from '~/services/auth.server';
import { getSession } from '~/services/session.server';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action = async ({ request }: ActionArgs) => {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    await verifyAuthenticityToken(request, session);
  } catch {
    return redirect('/users');
  }

  const form = await request.formData();
  const email = form.get('email');
  const roles = form.getAll('roles');
  const password = form.get('password');
  const passwordConfirmation = form.get('passwordConfirmation');

  try {
    const parsedForm = CreateUserSchema.parse({
      email,
      roles,
      password,
      passwordConfirmation,
    });

    await db.user.create({
      data: {
        email: parsedForm.email,
        passwordHash: await hashPassword(parsedForm.password),
        roles: {
          createMany: {
            data: parsedForm.roles.map((role) => ({ role })),
          },
        },
      },
    });
    return redirect('/users');
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return badRequest({
        formError: 'A user with this email already exists',
      });
    }

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
    resolver: zodResolver(CreateUserSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      roles: [],
      password: '',
      passwordConfirmation: '',
    },
  });

  const handleCloseClick = () => {
    navigate('/users');
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
          <h3 className="font-bold text-lg mb-4">Create a new user</h3>
          <UserForm
            isSubmitDisabled={['submitting', 'loading'].includes(
              navigation.state,
            )}
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
