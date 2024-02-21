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
  const deliveryPlans = await db.deliveryPlan.findMany({
    select: {
      id: true,
      name: true,
      startDate: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  const session = await getSession(request.headers.get('Cookie'));
  const deleteDeliveryPlanAction = session.get(
    SessionFlashKey.DeleteDeliveryPlanMeta,
  );

  return json({ authenticatedUser, deliveryPlans, deleteDeliveryPlanAction });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    [ActionType.DeleteItemConfirmation]: async () => {
      const form = await request.formData();
      const deliveryPlanId = form.get('_itemId');

      let deleteAction: ActionData['deleteAction'];

      try {
        const parsedForm = DeleteItemConfirmationFormSchema.parse({
          itemId: deliveryPlanId,
        });
        await db.deliveryPlan.delete({ where: { id: parsedForm.itemId } });

        deleteAction = { isSuccessful: true };
      } catch (error) {
        deleteAction = { isSuccessful: false, error: SOMETHING_WENT_WRONG };
      } finally {
        const session = await getSession(request.headers.get('Cookie'));
        session.flash(SessionFlashKey.DeleteDeliveryPlanMeta, deleteAction);

        return redirect('/delivery-plans', {
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
  const { deliveryPlans, deleteDeliveryPlanAction } =
    useLoaderData<typeof loader>();
  const [deliveryPlanIdToDelete, setDeliveryPlanIdToDelete] =
    useState<string>();
  const [deleteActionError, setDeleteActionError] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (deleteDeliveryPlanAction?.isSuccessful)
      setDeliveryPlanIdToDelete(undefined);
    if (deleteDeliveryPlanAction?.error)
      setDeleteActionError(deleteDeliveryPlanAction.error);
  }, [deleteDeliveryPlanAction]);

  const handleNewDeliveryPlanClick = () => navigate('new');

  const getOnDeliveryPlanClickHandler = (deliveryPlanId: string) => () =>
    navigate(deliveryPlanId);

  const getOnDeleteClickHandler =
    (deliveryPlanId: string) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event) event.stopPropagation();
      if (['submitting', 'loading'].includes(navigation.state)) return;

      setDeliveryPlanIdToDelete(deliveryPlanId);
    };

  const handleDeleteModalClose = () => {
    setDeliveryPlanIdToDelete(undefined);
    setDeleteActionError(undefined);
  };

  return (
    <div>
      <Outlet />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-medium">Delivery plans</h1>
        </div>
        <button
          className="btn btn-circle btn-outline"
          onClick={handleNewDeliveryPlanClick}
        >
          <Plus size={20} />
        </button>
      </div>

      {deliveryPlanIdToDelete && (
        <DeleteItemConfirmationModal
          itemId={deliveryPlanIdToDelete}
          formError={deleteActionError}
          isSubmitting={['submitting', 'loading'].includes(navigation.state)}
          onClose={handleDeleteModalClose}
        />
      )}

      <div className="overflow-x-auto">
        {deliveryPlans.length === 0 ? (
          <NoRecordsPlaceholder />
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Sart date</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {deliveryPlans.map((deliveryPlan, index) => (
                <tr
                  key={deliveryPlan.id}
                  className="hover"
                  onClick={getOnDeliveryPlanClickHandler(deliveryPlan.id)}
                >
                  <th>{index + 1}</th>
                  <th>{deliveryPlan.name}</th>
                  <th>{deliveryPlan.startDate}</th>
                  <th>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={getOnDeleteClickHandler(deliveryPlan.id)}
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
