import { UserRole } from '@prisma/client';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Plus, Trash } from 'react-feather';
import { verifyAuthenticityToken } from 'remix-utils';
import { DeleteItemConfirmationModal } from '~/components/DeleteItemConfirmationModal';
import { DeleteItemConfirmationFormSchema } from '~/schemas/deleteItemConfirmationForm';
import { authenticator } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { SessionFlashKey } from '~/utils/consts/sessionFlashes';
import { db } from '~/utils/db.server';

type ActionData = {
  deleteAction?: {
    isSuccessful: boolean;
    error?: string;
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const authenticatedUser = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      roles: {
        select: {
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  const session = await getSession(request.headers.get('Cookie'));
  const deleteUserAction = session.get(SessionFlashKey.DeleteUserMeta);

  return json(
    { authenticatedUser, users, deleteUserAction },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  );
};

export const action = async ({ request }: ActionArgs) => {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    await verifyAuthenticityToken(request, session);
  } catch {
    return redirect('/users');
  }

  const form = await request.formData();
  const method = form.get('_method');
  let deleteAction: ActionData['deleteAction'];

  if (method === ActionType.DeleteItemConfirmation) {
    const authenticatedUser = await authenticator.isAuthenticated(request, {
      failureRedirect: '/login',
    });

    const userId = form.get('_itemId');

    try {
      if (userId === authenticatedUser.id) {
        throw new Error('You cannot delete yourself!');
      }

      const parsedForm = DeleteItemConfirmationFormSchema.parse({
        method,
        itemId: userId,
      });
      await db.user.delete({ where: { id: parsedForm.itemId } });
      deleteAction = { isSuccessful: true };
    } catch (error) {
      deleteAction = { isSuccessful: false, error: SOMETHING_WENT_WRONG };
    } finally {
      const session = await getSession(request.headers.get('Cookie'));
      session.flash(SessionFlashKey.DeleteUserMeta, deleteAction);

      return redirect('/users', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    }
  }

  return redirect('/users');
};

export const Users = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { authenticatedUser, users, deleteUserAction } =
    useLoaderData<typeof loader>();
  const [userIdToDelete, setUserIdToDelete] = useState<string>();

  const [deleteActionError, setDeleteActionError] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (deleteUserAction?.isSuccessful) {
      setUserIdToDelete(undefined);
    }

    if (deleteUserAction?.error) {
      setDeleteActionError(deleteUserAction.error);
    }
  }, [deleteUserAction]);

  const handleNewUserClick = () => navigate('new');

  const getOnUserClickHandler = (userId: string) => () => navigate(userId);

  const getOnDeleteClickHandler =
    (userId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event) {
        event.stopPropagation();
      }

      if (['submitting', 'loading'].includes(navigation.state)) {
        return;
      }

      setUserIdToDelete(userId);
    };

  const handleDeleteModalClose = () => {
    setUserIdToDelete(undefined);
    setDeleteActionError(undefined);
  };

  return (
    <div>
      <Outlet />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-medium">Users</h1>
        </div>
        <button
          className="btn btn-circle btn-outline"
          onClick={handleNewUserClick}
        >
          <Plus size={20} />
        </button>
      </div>

      {userIdToDelete && (
        <DeleteItemConfirmationModal
          itemId={userIdToDelete}
          formError={deleteActionError}
          isSubmitting={['submitting', 'loading'].includes(navigation.state)}
          onClose={handleDeleteModalClose}
        />
      )}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Email</th>
              <th>Role</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="hover"
                onClick={getOnUserClickHandler(user.id)}
              >
                <th>{index + 1}</th>
                <th>{user.email}</th>
                <th>
                  {user.roles.map(({ role }, index) => (
                    <div
                      key={role}
                      className={clsx(
                        'badge badge-outline',
                        role === UserRole.Admin && 'badge-accent',
                        index !== user.roles.length - 1 && 'mr-2',
                      )}
                    >
                      {role}
                    </div>
                  ))}
                </th>
                <th>
                  {authenticatedUser.id !== user.id && (
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={getOnDeleteClickHandler(user.id)}
                    >
                      <Trash size={20} />
                    </button>
                  )}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
