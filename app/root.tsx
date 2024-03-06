import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react';
import { commitSession, getSession } from '~/services/session.server';
import '~/tailwind.css';
import { csrf } from '~/utils/csrf.server';

type LoaderData = {
  csrf: string;
};

export const meta: MetaFunction = () => [{ title: 'Light' }];

export const loader: LoaderFunction = async ({ request }) => {
  const [token, cookieHeader] = await csrf.commitToken();
  const session = await getSession(request.headers.get('Cookie'));

  const headers = new Headers();

  if (cookieHeader) {
    headers.append('Set-Cookie', cookieHeader);
  }
  headers.append('Set-Cookie', await commitSession(session));

  return json<LoaderData>({ csrf: token }, { headers });
};

const Root = () => {
  const { csrf } = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthenticityTokenProvider token={csrf}>
          <Outlet />
        </AuthenticityTokenProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default Root;
