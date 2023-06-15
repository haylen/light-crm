import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const Modal = ({ children }: Props) => {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    setCanRender(true);
  }, []);

  if (!canRender) return null;

  return createPortal(children, document.body);
};
