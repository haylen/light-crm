import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';

export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: '/login' });
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  return json({ user });
};

export const Index = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <h1>
      {user.email}
      <br />
      <Form method="post">
        <button>Log Out</button>
      </Form>
    </h1>
  );
};

export default Index;
