import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Plus, Trash } from 'react-feather';
import { namedAction } from 'remix-utils/named-action';
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticatedUser = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  const brokerIntegrations = await db.brokerIntegration.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const session = await getSession(request.headers.get('Cookie'));
  const deleteBrokerIntegrationAction = session.get(
    SessionFlashKey.DeleteBrokerIntegrationMeta,
  );

  return json({
    authenticatedUser,
    brokerIntegrations,
    deleteBrokerIntegrationAction,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.DeleteItemConfirmation]: async () => {
      const form = await request.formData();
      const brokerIntegrationId = form.get('_itemId');

      let deleteAction: ActionData['deleteAction'];

      try {
        const parsedForm = DeleteItemConfirmationFormSchema.parse({
          itemId: brokerIntegrationId,
        });
        await db.brokerIntegration.delete({ where: { id: parsedForm.itemId } });

        deleteAction = { isSuccessful: true };
      } catch (error) {
        deleteAction = { isSuccessful: false, error: SOMETHING_WENT_WRONG };
      } finally {
        const session = await getSession(request.headers.get('Cookie'));
        session.flash(
          SessionFlashKey.DeleteBrokerIntegrationMeta,
          deleteAction,
        );

        return redirect('/broker-integrations', {
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
  const { brokerIntegrations, deleteBrokerIntegrationAction } =
    useLoaderData<typeof loader>();
  const [brokerIntegrationIdToDelete, setBrokerIntegrationIdToDelete] =
    useState<string>();
  const [deleteActionError, setDeleteActionError] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (deleteBrokerIntegrationAction?.isSuccessful)
      setBrokerIntegrationIdToDelete(undefined);
    if (deleteBrokerIntegrationAction?.error)
      setDeleteActionError(deleteBrokerIntegrationAction.error);
  }, [deleteBrokerIntegrationAction]);

  const handleNewBrokerIntegrationClick = () => navigate('new');

  const getOnBrokerIntegrationClickHandler =
    (brokerIntegrationId: string) => () =>
      navigate(brokerIntegrationId);

  const getOnDeleteClickHandler =
    (brokerIntegrationId: string) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event) event.stopPropagation();
      if (['submitting', 'loading'].includes(navigation.state)) return;

      setBrokerIntegrationIdToDelete(brokerIntegrationId);
    };

  const handleDeleteModalClose = () => {
    setBrokerIntegrationIdToDelete(undefined);
    setDeleteActionError(undefined);
  };

  return (
    <div>
      <Outlet />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-medium">Integrations</h1>
        </div>
        <button
          className="btn btn-circle btn-outline"
          onClick={handleNewBrokerIntegrationClick}
        >
          <Plus size={20} />
        </button>
      </div>

      {brokerIntegrationIdToDelete && (
        <DeleteItemConfirmationModal
          itemId={brokerIntegrationIdToDelete}
          formError={deleteActionError}
          isSubmitting={['submitting', 'loading'].includes(navigation.state)}
          onClose={handleDeleteModalClose}
        />
      )}

      <div className="overflow-x-auto">
        {brokerIntegrations.length === 0 ? (
          <NoRecordsPlaceholder />
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {brokerIntegrations.map((brokerIntegration, index) => (
                <tr
                  key={brokerIntegration.id}
                  className="hover"
                  onClick={getOnBrokerIntegrationClickHandler(
                    brokerIntegration.id,
                  )}
                >
                  <th>{index + 1}</th>
                  <th>{brokerIntegration.name}</th>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={getOnDeleteClickHandler(brokerIntegration.id)}
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
