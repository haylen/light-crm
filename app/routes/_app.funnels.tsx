import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Trash } from 'react-feather';
import { namedAction } from 'remix-utils/named-action';
import { promiseHash } from 'remix-utils/promise';
import { DeleteItemConfirmationModal } from '~/components/DeleteItemConfirmationModal';
import { NewRecordButton } from '~/components/NewRecordButton';
import { NoRecordsPlaceholder } from '~/components/NoRecordsPlaceholder';
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
  const { authenticatedUser, funnels, funnelsCount, session } =
    await promiseHash({
      authenticatedUser: authenticator.isAuthenticated(request, {
        failureRedirect: '/login',
      }),
      funnels: db.funnel.findMany({
        orderBy: { createdAt: 'desc' },
        ...getPaginationParams(request),
      }),
      funnelsCount: db.funnel.count(),
      session: getSession(request.headers.get('Cookie')),
    });

  const deleteFunnelAction = session.get(SessionFlashKey.DeleteFunnelMeta);

  return json({ authenticatedUser, funnels, funnelsCount, deleteFunnelAction });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.DeleteItemConfirmation]: async () => {
      const form = await request.formData();
      const funnelId = form.get('_itemId');

      let deleteAction: ActionData['deleteAction'];

      try {
        const parsedForm = DeleteItemConfirmationFormSchema.parse({
          itemId: funnelId,
        });
        await db.funnel.delete({ where: { id: parsedForm.itemId } });

        deleteAction = { isSuccessful: true };
      } catch (error) {
        deleteAction = { isSuccessful: false, error: SOMETHING_WENT_WRONG };
      } finally {
        const session = await getSession(request.headers.get('Cookie'));
        session.flash(SessionFlashKey.DeleteFunnelMeta, deleteAction);

        return redirect('/funnels', {
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
  const { funnels, funnelsCount, deleteFunnelAction } =
    useLoaderData<typeof loader>();
  const [funnelIdToDelete, setFunnelIdToDelete] = useState<string>();
  const [deleteActionError, setDeleteActionError] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (deleteFunnelAction?.isSuccessful) setFunnelIdToDelete(undefined);
    if (deleteFunnelAction?.error)
      setDeleteActionError(deleteFunnelAction.error);
  }, [deleteFunnelAction]);

  const handleNewFunnelClick = () => navigate('new');

  const getOnFunnelClickHandler = (funnelId: string) => () =>
    navigate(funnelId);

  const getOnDeleteClickHandler =
    (funnelId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event) event.stopPropagation();
      if (['submitting', 'loading'].includes(navigation.state)) return;

      setFunnelIdToDelete(funnelId);
    };

  const handleDeleteModalClose = () => {
    setFunnelIdToDelete(undefined);
    setDeleteActionError(undefined);
  };

  return (
    <div>
      <Outlet />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-medium">Funnels</h1>
        </div>
        <NewRecordButton onClick={handleNewFunnelClick} />
      </div>

      {funnelIdToDelete && (
        <DeleteItemConfirmationModal
          itemId={funnelIdToDelete}
          formError={deleteActionError}
          isSubmitting={['submitting', 'loading'].includes(navigation.state)}
          onClose={handleDeleteModalClose}
        />
      )}

      <div className="overflow-x-auto">
        {funnels.length === 0 ? (
          <NoRecordsPlaceholder />
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Website</th>
                <th>Country</th>
                <th>Language</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {funnels.map((funnel, index) => (
                <tr
                  key={funnel.id}
                  className="hover"
                  onClick={getOnFunnelClickHandler(funnel.id)}
                >
                  <th>{index + 1}</th>
                  <th className="text-nowrap">{funnel.name}</th>
                  <th className="text-nowrap">{funnel.websiteUrl}</th>
                  <th>{funnel.country}</th>
                  <th>{funnel.language}</th>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={getOnDeleteClickHandler(funnel.id)}
                    >
                      <Trash size={20} />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex flex-row-reverse mt-8">
        <TablePagination
          totalRecorsCount={funnelsCount}
          recordsPerPageCount={RECORDS_PER_PAGE}
        />
      </div>
    </div>
  );
};

export default Route;
