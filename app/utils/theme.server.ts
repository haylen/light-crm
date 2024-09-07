import { createCookieSessionStorage } from '@remix-run/node';
import { Theme } from '~/utils/consts/theme';
import { isTheme } from '~/utils/theme';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not set');
}

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: 'light-crm-theme',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
  },
});

export const getThemeSession = async (request: Request) => {
  const session = await themeStorage.getSession(request.headers.get('Cookie'));

  return {
    getTheme: (): Theme | null => {
      const themeValue = session.get('theme');
      return isTheme(themeValue) ? themeValue : null;
    },
    setTheme: (theme: Theme) => session.set('theme', theme),
    commitTheme: () => themeStorage.commitSession(session),
  };
};
