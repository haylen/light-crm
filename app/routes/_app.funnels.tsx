import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Plus, Trash } from 'react-feather';
import { namedAction, verifyAuthenticityToken } from 'remix-utils';
import { DeleteItemConfirmationModal } from '~/components/DeleteItemConfirmationModal';
import { NoRecordsPlaceholder } from '~/components/NoRecordsPlaceholder';
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
  const funnels = await db.funnel.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const session = await getSession(request.headers.get('Cookie'));
  const deleteFunnelAction = session.get(SessionFlashKey.DeleteFunnelMeta);

  return json({ authenticatedUser, funnels, deleteFunnelAction });
};

export const action = async ({ request }: ActionArgs) => {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    await verifyAuthenticityToken(request, session);
  } catch {
    return redirect('/funnels');
  }

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
  const { funnels, deleteFunnelAction } = useLoaderData<typeof loader>();
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
        <button
          className="btn btn-circle btn-outline"
          onClick={handleNewFunnelClick}
        >
          <Plus size={20} />
        </button>
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
                  <th>{funnel.name}</th>
                  <th>{funnel.websiteUrl}</th>
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
    </div>
  );
};

export default Route;
