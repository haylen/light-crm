import { UserRole } from '@prisma/client';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Trash } from 'react-feather';
import { namedAction } from 'remix-utils/named-action';
import { promiseHash } from 'remix-utils/promise';
import { DeleteItemConfirmationModal } from '~/components/DeleteItemConfirmationModal';
import { NewRecordButton } from '~/components/NewRecordButton';
import { TablePagination } from '~/components/TablePagination';
import { DeleteItemConfirmationFormSchema } from '~/schemas/deleteItemConfirmationForm';
import { authenticator } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';
import { SOMETHING_WENT_WRONG } from '~/utils/consts/errors';
import { ActionType } from '~/utils/consts/formActions';
import { SessionFlashKey } from '~/utils/consts/sessionFlashes';
import { db } from '~/utils/db.server';
import { RECORDS_PER_PAGE, getPaginationParams } from '~/utils/pagination';

type ActionData = {
  deleteAction?: {
    isSuccessful: boolean;
    error?: string;
  };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { authenticatedUser, users, usersCount, session } = await promiseHash({
    authenticatedUser: authenticator.isAuthenticated(request, {
      failureRedirect: '/login',
    }),
    users: db.user.findMany({
      select: {
        id: true,
        email: true,
        roles: { select: { role: true } },
      },
      orderBy: { createdAt: 'desc' },
      ...getPaginationParams(request),
    }),
    usersCount: db.user.count(),
    session: getSession(request.headers.get('Cookie')),
  });

  const deleteUserAction = session.get(SessionFlashKey.DeleteUserMeta);

  return json(
    { authenticatedUser, users, usersCount, deleteUserAction },
    { headers: { 'Set-Cookie': await commitSession(session) } },
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const authenticatedUser = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return namedAction(request, {
    [ActionType.DeleteItemConfirmation]: async () => {
      const form = await request.formData();
      const userId = form.get('_itemId');

      let deleteAction: ActionData['deleteAction'];

      try {
        if (userId === authenticatedUser.id) {
          throw new Error('You cannot delete yourself!');
        }

        const parsedForm = DeleteItemConfirmationFormSchema.parse({
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
    },
  });
};

export const Route = () => {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { authenticatedUser, users, usersCount, deleteUserAction } =
    useLoaderData<typeof loader>();
  const [userIdToDelete, setUserIdToDelete] = useState<string>();
  const [deleteActionError, setDeleteActionError] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (deleteUserAction?.isSuccessful) setUserIdToDelete(undefined);
    if (deleteUserAction?.error) setDeleteActionError(deleteUserAction.error);
  }, [deleteUserAction]);

  const handleNewUserClick = () => navigate('new');

  const getOnUserClickHandler = (userId: string) => () => navigate(userId);

  const getOnDeleteClickHandler =
    (userId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event) event.stopPropagation();
      if (['submitting', 'loading'].includes(navigation.state)) return;

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
        <NewRecordButton onClick={handleNewUserClick} />
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
              <th className="w-24" />
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
                <th className="text-nowrap">{user.email}</th>
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

      <div className="flex flex-row-reverse mt-8">
        <TablePagination
          totalRecorsCount={usersCount}
          recordsPerPageCount={RECORDS_PER_PAGE}
        />
      </div>
    </div>
  );
};

export default Route;
