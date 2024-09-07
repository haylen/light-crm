import { Theme } from '~/utils/consts/theme';

export const isTheme = (value: string): boolean =>
  (Object.values(Theme) as string[]).includes(value);
