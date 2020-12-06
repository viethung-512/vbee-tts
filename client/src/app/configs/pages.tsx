import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import ListItemIcon from '@material-ui/core/ListItemIcon';

interface AppRoute {
  path: string;
  exec: boolean;
  private: boolean;
  hasPermission: boolean;
  component: React.FC<RouteComponentProps>;
}

interface AppSidebarItem {
  label: string;
  allowAccess: boolean;
  icon?: React.ReactNode;
  items?: AppSidebarItem[];
}

interface Page {
  routePath: string;
  routeExec: boolean;
  title: string;
  private: boolean;
  hasPermission: boolean;
  component: React.FC<RouteComponentProps>;
  sidebarLabel?: string;
}

// interface PageConfigValue {
//   path: Page['routePath'],
// }

// const pages: Page[] = [
//   {
//     routePath: '/',
//     routeExec: true,
//     title: 'Home Page',
//     sidebarLabel: 'Home Page',
//     private: true,
//     hasPermission: true
//   }
// ]

// const AppPage
