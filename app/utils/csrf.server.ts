import { createCookie } from '@remix-run/node';
import { CSRF } from 'remix-utils/csrf/server';

const csrfSecret = process.env.CSRF_SECRET;
if (!csrfSecret) {
  throw new Error('CSRF_SECRET is not set');
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not set');
}

export const cookie = createCookie('csrf', {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  secrets: [sessionSecret],
});

export const csrf = new CSRF({
  cookie,
  // what key in FormData objects will be used for the token, defaults to `csrf`
  formDataKey: 'csrf',
  // an optional secret used to sign the token, recommended for extra safety
  secret: csrfSecret,
});
