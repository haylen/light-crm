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
  const brokers = await db.broker.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const session = await getSession(request.headers.get('Cookie'));
  const deleteBrokerAction = session.get(SessionFlashKey.DeleteBrokerMeta);

  return json({ authenticatedUser, brokers, deleteBrokerAction });
};

export const action = async ({ request }: ActionArgs) => {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    await verifyAuthenticityToken(request, session);
  } catch {
    return redirect('/brokers');
  }

  return namedAction(request, {
    [ActionType.DeleteItemConfirmation]: async () => {
      const form = await request.formData();
      const brokerId = form.get('_itemId');

      let deleteAction: ActionData['deleteAction'];

      try {
        const parsedForm = DeleteItemConfirmationFormSchema.parse({
          itemId: brokerId,
        });
        await db.broker.delete({ where: { id: parsedForm.itemId } });

        deleteAction = { isSuccessful: true };
      } catch (error) {
        deleteAction = { isSuccessful: false, error: SOMETHING_WENT_WRONG };
      } finally {
        const session = await getSession(request.headers.get('Cookie'));
        session.flash(SessionFlashKey.DeleteBrokerMeta, deleteAction);

        return redirect('/brokers', {
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
  const { brokers, deleteBrokerAction } = useLoaderData<typeof loader>();
  const [brokerIdToDelete, setBrokerIdToDelete] = useState<string>();
  const [deleteActionError, setDeleteActionError] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (deleteBrokerAction?.isSuccessful) setBrokerIdToDelete(undefined);
    if (deleteBrokerAction?.error)
      setDeleteActionError(deleteBrokerAction.error);
  }, [deleteBrokerAction]);

  const handleNewBrokerClick = () => navigate('new');

  const getOnBrokerClickHandler = (brokerId: string) => () =>
    navigate(brokerId);

  const getOnDeleteClickHandler =
    (brokerId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event) event.stopPropagation();
      if (['submitting', 'loading'].includes(navigation.state)) return;

      setBrokerIdToDelete(brokerId);
    };

  const handleDeleteModalClose = () => {
    setBrokerIdToDelete(undefined);
    setDeleteActionError(undefined);
  };

  return (
    <div>
      <Outlet />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-medium">Brokers</h1>
        </div>
        <button
          className="btn btn-circle btn-outline"
          onClick={handleNewBrokerClick}
        >
          <Plus size={20} />
        </button>
      </div>

      {brokerIdToDelete && (
        <DeleteItemConfirmationModal
          itemId={brokerIdToDelete}
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
              <th>Name</th>
              <th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {brokers.map((broker, index) => (
              <tr
                key={broker.id}
                className="hover"
                onClick={getOnBrokerClickHandler(broker.id)}
              >
                <th>{index + 1}</th>
                <th>{broker.name}</th>
                <th>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={getOnDeleteClickHandler(broker.id)}
                  >
                    <Trash size={20} />
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Route;
