import { json, redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Theme } from '~/utils/consts/theme';
import { isTheme } from '~/utils/theme';
import { getThemeSession } from '~/utils/theme.server';

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get('theme');

  if (theme && !isTheme(theme)) {
    return json({
      success: false,
      message: `Theme value of ${theme} is not a valid theme`,
    });
  }

  if (theme) {
    themeSession.setTheme(theme as Theme);
  }

  return json(
    { success: true },
    { headers: { 'Set-Cookie': await themeSession.commitTheme() } },
  );
};

export const loader: LoaderFunction = () => redirect('/');
