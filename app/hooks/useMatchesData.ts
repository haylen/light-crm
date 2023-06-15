import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON | undefined} The router data or undefined if not found
 */
export const useMatchesData = (
  id: string,
): Record<string, unknown> | undefined => {
  const matchingRoutes = useMatches();

  console.log('matchingRoutes', matchingRoutes);

  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );

  return route?.data;
};
