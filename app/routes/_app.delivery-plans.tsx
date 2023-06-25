import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json({ user });
};

export const Route = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <div>Delivery plans - {user.email}</div>
      <Outlet />
    </>
  );
};

export default Route;
