import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { verifyAuthenticityToken } from 'remix-utils';
import { authenticator } from '~/services/auth.server';
import { getSession } from '~/services/session.server';

export const action = async ({ request }: ActionArgs) => {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    await verifyAuthenticityToken(request, session);
  } catch {
    return redirect('/');
  }

  await authenticator.logout(request, { redirectTo: '/login' });
};

export const loader = async () => redirect('/');
