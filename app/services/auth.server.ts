import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { LoginSchema } from '~/schemas/loginForm';
import { sessionStorage } from '~/services/session.server';
import { db } from '~/utils/db.server';

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    // Here you can use `form` to access and input values from the form.
    // and also use `context` to access more things from the server
    const email = form.get('email');
    const password = form.get('password');

    try {
      const parsedForm = LoginSchema.parse({ email, password });
      const user = await db.user.findUnique({
        where: { email: parsedForm.email },
      });

      if (!user) throw new AuthorizationError('User is not found');

      const isCorrectPassword = await bcrypt.compare(
        parsedForm.password,
        user.passwordHash,
      );

      if (!isCorrectPassword) throw new AuthorizationError('Password invalid');

      return user;
    } catch (error) {
      throw new AuthorizationError('Email and password do not match');
    }
  }),
);
