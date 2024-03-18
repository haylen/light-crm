import { Form, NavLink } from '@remix-run/react';
import { type PropsWithChildren } from 'react';
import {
  Briefcase,
  Crosshair,
  Filter,
  Grid,
  LogOut,
  Menu,
  UploadCloud,
  Users,
} from 'react-feather';
import { ThemeToggler } from '~/components/ThemeToggler';

export const PageLayout = ({ children }: PropsWithChildren) => (
  <div className="bg-base-300">
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen lg:!z-20">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <label
              htmlFor="sidebar-drawer"
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
            <p>Copyright © 2024 - All rights reserved by Light CRM</p>
          </div>
        </footer>
      </div>
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay" />
        <ul className="menu min-h-full p-4 w-80 bg-base-100 text-base-content gap-2">
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
          <li>
            <NavLink
              to="/funnels"
              prefetch="intent"
              className={({ isActive, isPending }) =>
                isPending ? 'active' : isActive ? 'active' : ''
              }
            >
              <Filter size={20} />
              Funnels
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              prefetch="intent"
              className={({ isActive, isPending }) =>
                isPending ? 'active' : isActive ? 'active' : ''
              }
            >
              <Users size={20} />
              Users
            </NavLink>
          </li>
          <div className="divider">Connect</div>
          <li>
            <NavLink
              to="/broker-integrations"
              prefetch="intent"
              className={({ isActive, isPending }) =>
                isPending ? 'active' : isActive ? 'active' : ''
              }
            >
              <UploadCloud size={20} />
              Integrations
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
);
