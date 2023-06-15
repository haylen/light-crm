import { Outlet } from '@remix-run/react';
import { PageLayout } from '~/components/PageLayout';

export const App = () => (
  <PageLayout>
    <Outlet />
  </PageLayout>
);

export default App;
