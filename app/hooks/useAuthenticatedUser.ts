import type { User } from '@prisma/client';
import { useMatchesData } from './useMatchesData';

const isUser = (user: any): user is User => {
  return user && typeof user === 'object' && typeof user.email === 'string';
};

export const useOptionalAuthenticatedUser = (): User | undefined => {
  const data = useMatchesData('root');

  if (!data || !isUser(data.authenticatedUser)) {
    return undefined;
  }

  return data.authenticatedUser;
};

export const useAuthenticatedUser = (): User => {
  const maybeUser = useOptionalAuthenticatedUser();

  if (!maybeUser) {
    throw new Error(
      'No user found in the root loader, but user is required by useAuthenticatedUser.',
    );
  }

  return maybeUser;
};
