import { useFetcher } from '@remix-run/react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { Theme } from '~/utils/consts/theme';
import { isTheme } from '~/utils/theme';

type ThemeContextType = [Theme | null, Dispatch<SetStateAction<Theme | null>>];
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const prefersDarkMQ = '(prefers-color-scheme: dark)';
const clientThemeCode = `
;(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersDarkMQ)}).matches ? 'dark' : 'light';
  document.querySelector('html')?.setAttribute('data-theme', theme)
})();
`;
const getPreferredTheme = () =>
  window.matchMedia(prefersDarkMQ).matches ? Theme.Dark : Theme.Light;

export const ThemeSetterScript = ({
  withSSRTheme,
}: {
  withSSRTheme: boolean;
}) =>
  withSSRTheme ? null : (
    <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
  );

export const ThemeProvider = ({
  children,
  specifiedTheme,
}: {
  children: ReactNode;
  specifiedTheme: Theme | null;
}) => {
  const [theme, setTheme] = useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (isTheme(specifiedTheme)) {
        return specifiedTheme;
      } else {
        return null;
      }
    }

    /*
     * There is no way to know what the theme should be during the SSR phase,
     * the client side has to figure it out before hydration.
     */
    if (typeof window !== 'object') {
      return null;
    }

    return getPreferredTheme();
  });

  const mountRun = useRef(false);
  const persistTheme = useFetcher();

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }

    if (!theme) {
      return;
    }

    persistTheme.submit(
      { theme },
      { action: 'actions/set-theme', method: 'post' },
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
