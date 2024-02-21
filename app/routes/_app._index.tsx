import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json({ user });
};

export const Route = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <div>Home - {user.email}</div>
    </>
  );
};

export default Route;
