import { type PropsWithChildren } from 'react';

export const FormInputError = ({ children }: PropsWithChildren) => (
  <p className="h-4 text-error text-xs mt-2 mb-2 pl-1">{children}</p>
);
