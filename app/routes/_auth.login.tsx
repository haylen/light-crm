import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
} from '@remix-run/react';
import { clsx } from 'clsx';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { AuthenticityTokenInput, verifyAuthenticityToken } from 'remix-utils';
import { ThemeToggler } from '~/components/ThemeToggler';
import type { FormInput } from '~/schemas/loginForm';
import { LoginSchema } from '~/schemas/loginForm';
import { authenticator } from '~/services/auth.server';
import { getSession, sessionStorage } from '~/services/session.server';

type LoaderError = { message: string } | null;

export const action = async ({ request }: ActionArgs) => {
  try {
    const session = await getSession(request.headers.get('Cookie'));
    await verifyAuthenticityToken(request, session);
  } catch {
    return redirect('/login');
  }

  await authenticator.authenticate('form', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  });
};

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  );
  const error = session.get(authenticator.sessionErrorKey) as LoaderError;

  return json({ error });
};

export const Route = () => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const { error } = useLoaderData<typeof loader>();
  const methods = useForm<FormInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit: SubmitHandler<FormInput> = async (_data, event) => {
    if (event) submit(event.target, { replace: true });
  };

  return (
    <>
      <div className="absolute navbar bg-base-100 flex justify-end">
        <div className="mr-4">
          <ThemeToggler />
        </div>
      </div>

      <div className="h-screen flex items-center justify-center flex-col">
        <div className="card w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-2">
              <p className="text-center text-accent-focus">Welcome</p>
            </h2>

            <Form method="post" onSubmit={methods.handleSubmit(handleSubmit)}>
              <AuthenticityTokenInput />

              <div>
                <label htmlFor="email" className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className={clsx(
                    'input input-bordered w-full max-w-xs',
                    methods.formState.errors?.email?.message && 'input-error',
                  )}
                  {...methods.register('email')}
                />
              </div>

              <p className="h-4 text-error text-xs mt-2 pl-1">
                {methods.formState.errors?.email?.message}
              </p>

              <div className="mt-1">
                <label htmlFor="password" className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className={clsx(
                    'input input-bordered w-full max-w-xs',
                    methods.formState.errors?.password?.message &&
                      'input-error',
                  )}
                  {...methods.register('password')}
                />
              </div>

              <p className="h-4 text-error text-xs mt-2 pl-1">
                {methods.formState.errors?.password?.message}
              </p>

              <div className="mt-2 pl-1 h-8 flex items-center">
                {methods.formState.submitCount !== 0 && error?.message && (
                  <p className="text-error text-xs">{error?.message}</p>
                )}
              </div>

              <div className="card-actions justify-end mt-4">
                <button
                  disabled={
                    (!methods.formState.isValid &&
                      methods.formState.submitCount !== 0) ||
                    ['submitting', 'loading'].includes(navigation.state)
                  }
                  className={`btn btn-accent btn-block ${
                    ['submitting', 'loading'].includes(navigation.state)
                      ? 'loading'
                      : ''
                  }`}
                >
                  {['submitting', 'loading'].includes(navigation.state)
                    ? ''
                    : 'Log In'}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Route;
