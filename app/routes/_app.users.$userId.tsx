import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@prisma/client';
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
import { UserForm } from '~/components/forms/UserForm';
import type { FormInput } from '~/schemas/user';
import { UpdateUserSchema } from '~/schemas/user';
import { hashPassword } from '~/services/auth.server';
import {
  PRISMA_UNIQUENESS_CONSTRAINT_ERROR_CODE,
  SOMETHING_WENT_WRONG,
} from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

const formResolver = zodResolver(UpdateUserSchema);

export const action = async ({ request, params }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.UpdateUser]: async () => {
      try {
        const { errors, data } = await getValidatedFormData<FormInput>(
          request,
          formResolver,
        );

        if (errors) {
          throw new Error('Form validation failed');
        }

        const user = await db.user.findUniqueOrThrow({
          select: { roles: { select: { id: true } } },
          where: { id: params.userId },
        });

        const updatePasswordData: { passwordHash?: string } = {};

        if (data.password) {
          updatePasswordData.passwordHash = await hashPassword(data.password);
        }

        await db.user.update({
          where: { id: params.userId },
          data: {
            email: data.email,
            ...updatePasswordData,
            roles: {
              deleteMany: { id: { in: user.roles.map(({ id }) => id) } },
              createMany: {
                data: data.roles.map((role) => ({ role })),
              },
            },
          },
        });

        return redirect('/users');
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === PRISMA_UNIQUENESS_CONSTRAINT_ERROR_CODE
        ) {
          return json(
            { formError: 'A user with this email already exists' },
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
    const user = await db.user.findUniqueOrThrow({
      select: {
        id: true,
        email: true,
        roles: { select: { role: true } },
      },
      where: { id: params.userId },
    });

    return json({ user });
  } catch (error) {
    return redirect('/users');
  }
};

export const Route = () => {
  const actionData = useActionData<typeof action>();
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const methods = useRemixForm<FormInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      email: user.email,
      roles: user.roles.map(({ role }) => role),
      password: '',
      passwordConfirmation: '',
    },
    submitConfig: {
      action: `?/${ActionType.UpdateUser}`,
    },
  });

  const handleCloseClick = () => navigate('/users');

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-lg">
          <ModalCloseButton onClose={handleCloseClick} />
          <h3 className="font-bold text-lg mb-4">View the user</h3>
          <UserForm
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
