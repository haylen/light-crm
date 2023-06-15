import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json({ user });
};

export const DeliveryPlans = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <div>New Delivery plan - {user.email}</div>
    </>
  );
};

export default DeliveryPlans;
