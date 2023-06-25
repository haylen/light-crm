import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import {
  AuthenticityTokenProvider,
  createAuthenticityToken,
} from 'remix-utils';
import { commitSession, getSession } from '~/services/session.server';
import stylesheet from '~/tailwind.css';

type LoaderData = {
  csrf: string;
};

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Light',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const token = createAuthenticityToken(session);

  return json<LoaderData>(
    { csrf: token },
    { headers: { 'Set-Cookie': await commitSession(session) } },
  );
};

const Root = () => {
  const { csrf } = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AuthenticityTokenProvider token={csrf}>
          <Outlet />
        </AuthenticityTokenProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export default Root;
