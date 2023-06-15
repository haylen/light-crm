import type { ActionArgs } from '@remix-run/node';
import { Form, NavLink } from '@remix-run/react';
import { Briefcase, Crosshair, Grid, LogOut, Menu } from 'react-feather';
import { ThemeToggler } from '~/components/ThemeToggler';
import { authenticator } from '~/services/auth.server';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const action = async ({ request }: ActionArgs) => {
  await authenticator.logout(request, { redirectTo: '/login' });
};

export const PageLayout = ({ children }: Props) => (
  <div className="bg-base-300">
    <div className="drawer drawer-mobile">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col lg:!z-20">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-outline drawer-button lg:hidden"
            >
              <Menu size={20} />
            </label>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <ThemeToggler />
              </li>
              <li>
                <Form action="/logout" method="post">
                  <button>
                    <LogOut size={20} />
                  </button>
                </Form>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto py-10 px-5 flex-grow">{children}</div>
        <footer className="footer footer-center p-4 bg-base-300 text-base-content">
          <div>
            <p>Copyright © 2023 - All rights reserved by Light CRM</p>
          </div>
        </footer>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 text-base-content gap-2">
          <div className="h-12">Logo</div>
          <li>
            <NavLink
              to="/"
              prefetch="intent"
              className={({ isActive, isPending }) =>
                isPending ? 'active' : isActive ? 'active' : ''
              }
            >
              <Grid size={20} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/brokers"
              prefetch="intent"
              className={({ isActive, isPending }) =>
                isPending ? 'active' : isActive ? 'active' : ''
              }
            >
              <Briefcase size={20} />
              Brokers
            </NavLink>
            <link rel="prefetch" href="/brokers" />
          </li>
          <li>
            <NavLink
              to="/delivery-plans"
              prefetch="intent"
              className={({ isActive, isPending }) =>
                isPending ? 'active' : isActive ? 'active' : ''
              }
            >
              <Crosshair size={20} />
              Delivery plans
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
);
