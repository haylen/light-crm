import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {T | undefined} The router data or undefined if not found
 */
export const useMatchesData = <T>(id: string): T | undefined => {
  const matchingRoutes = useMatches();

  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );

  if (!route || !route.data) {
    return undefined;
  }

  return route.data as T;
};
