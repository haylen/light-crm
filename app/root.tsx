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
import { ThemeProvider, ThemeSetterScript } from '~/components/ThemeProvider';
import { commitSession, getSession } from '~/services/session.server';
import '~/tailwind.css';
import { Theme } from '~/utils/consts/theme';
import { csrf } from '~/utils/csrf.server';
import { getThemeSession } from '~/utils/theme.server';

type LoaderData = {
  csrf: string;
  theme: Theme | null;
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

  const themeSession = await getThemeSession(request);

  return json<LoaderData>(
    { csrf: token, theme: themeSession.getTheme() },
    { headers },
  );
};

const Root = () => {
  const { csrf, theme } = useLoaderData<LoaderData>();

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeSetterScript withSSRTheme={Boolean(theme)} />
      </head>
      <body>
        <AuthenticityTokenProvider token={csrf}>
          <ThemeProvider specifiedTheme={theme}>
            <Outlet />
          </ThemeProvider>
        </AuthenticityTokenProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default Root;
