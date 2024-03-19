import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma } from '@prisma/client';
import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useNavigate, useNavigation } from '@remix-run/react';
import { getValidatedFormData, useRemixForm } from 'remix-hook-form';
import { namedAction } from 'remix-utils/named-action';
import { Modal } from '~/components/Modal';
import { ModalCloseButton } from '~/components/ModalCloseButton';
import { UserForm } from '~/components/forms/UserForm';
import type { FormInput } from '~/schemas/user';
import { CreateUserSchema } from '~/schemas/user';
import { hashPassword } from '~/services/auth.server';
import {
  PRISMA_UNIQUENESS_CONSTRAINT_ERROR_CODE,
  SOMETHING_WENT_WRONG,
} from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { db } from '~/utils/db.server';

const formResolver = zodResolver(CreateUserSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.CreateUser]: async () => {
      try {
        const { errors, data } = await getValidatedFormData<FormInput>(
          request,
          formResolver,
        );

        if (errors) {
          throw new Error('Form validation failed');
        }

        await db.user.create({
          data: {
            email: data.email,
            passwordHash: await hashPassword(data.password),
            roles: {
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

export const Route = () => {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const methods = useRemixForm<FormInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: '',
      roles: [],
      password: '',
      passwordConfirmation: '',
    },
    submitConfig: {
      action: `?/${ActionType.CreateUser}`,
    },
  });

  const handleCloseClick = () => navigate('/users');

  return (
    <Modal>
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-lg">
          <ModalCloseButton onClose={handleCloseClick} />
          <h3 className="font-bold text-lg mb-4">Create a new user</h3>
          <UserForm
            isNew
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
