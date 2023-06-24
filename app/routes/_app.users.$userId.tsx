import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@prisma/client';
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
import { verifyAuthenticityToken } from 'remix-utils';
import { Modal } from '~/components/Modal';
import { UserForm } from '~/components/UserForm';
import type { FormInput } from '~/schemas/user';
import { UpdateUserSchema } from '~/schemas/user';
import { hashPassword } from '~/services/auth.server';
import { getSession } from '~/services/session.server';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    role: string | undefined;
    password: string | undefined;
    passwordConfirmation: string | undefined;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action = async ({ request, params }: ActionArgs) => {
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
    const parsedForm = UpdateUserSchema.parse({
      email,
      roles,
      password,
      passwordConfirmation,
    });

    const user = await db.user.findUniqueOrThrow({
      select: {
        roles: {
          select: {
            id: true,
          },
        },
      },
      where: { id: params.userId },
    });

    const updatePasswordData: { passwordHash?: string } = {};

    if (parsedForm.password) {
      updatePasswordData.passwordHash = await hashPassword(parsedForm.password);
    }

    await db.user.update({
      where: { id: params.userId },
      data: {
        email: parsedForm.email,
        ...updatePasswordData,
        roles: {
          deleteMany: { id: { in: user.roles.map(({ id }) => id) } },
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

export const loader = async ({ params }: LoaderArgs) => {
  try {
    const user = await db.user.findUniqueOrThrow({
      select: {
        id: true,
        email: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
      where: { id: params.userId },
    });

    return json({ user });
  } catch (error) {
    return redirect('/users');
  }
};

export const UserView = () => {
  const actionData = useActionData<ActionData>();
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<FormInput>({
    resolver: zodResolver(UpdateUserSchema),
    mode: 'onChange',
    defaultValues: {
      email: user.email,
      roles: user.roles.map(({ role }) => role),
      password: '',
      passwordConfirmation: '',
    },
  });

  const handleCloseClick = () => navigate('/users');

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
          <h3 className="font-bold text-lg mb-4">View the user</h3>
          <UserForm
            isSubmitDisabled={
              !methods.formState.isDirty ||
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

export default UserView;
