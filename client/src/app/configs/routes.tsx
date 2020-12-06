import React from 'react';
import { Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';
import { Action, Resource } from '@tts-dev/common';

// pages
import Dashboard from 'pages/dashboard/Dashboard';
import ManageUsers from 'pages/user/ManageUsers';
import UserDetails from 'pages/user/UserDetails';
import UserInfo from 'pages/user/UserInfo';
import NotFoundPage from 'pages/NotFoundPage';
import UnauthorizedPage from 'pages/UnauthorizedPage';
import ManageRoles from 'pages/role/ManageRoles';
import RoleNeedApprove from 'pages/role/RoleNeedApprove';
import RoleDetails from 'pages/role/RoleDetails';
import ImportSentences from 'pages/sentence/ImportSentences';
import ManageSentences from 'pages/sentence/ManageSentences';
import SentenceDetails from 'pages/sentence/SentenceDetails';
import ImportRecords from 'pages/record/ImportRecords';
import ManageRecords from 'pages/record/ManageRecords';
import RecordDetails from 'pages/record/RecordDetails';

import Settings from 'pages/auth/Settings';

export interface AppRoute extends RouteProps {
  private: boolean;
  resources: {
    name: Resource;
    actions: Action[];
  }[];
  hasPermission?: boolean;
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  pageTitle?: string;
}

const dashboardRoutes: AppRoute[] = [
  {
    exact: true,
    path: '/',
    private: true,
    resources: [],
    hasPermission: true,
    pageTitle: 'TITLE_DASHBOARD',
    component: () => <Redirect to='/dashboard' />,
  },
  {
    exact: true,
    path: '/dashboard',
    private: true,
    resources: [],
    hasPermission: true,
    pageTitle: 'TITLE_DASHBOARD',
    component: () => <Dashboard />,
  },
];
const userRoutes: AppRoute[] = [
  {
    exact: true,
    path: '/users',
    private: true,
    resources: [
      {
        name: Resource.USER,
        actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
      },
    ],
    pageTitle: 'TITLE_MANAGE_USERS',
    component: ({ match, history }: RouteComponentProps) => (
      <ManageUsers history={history} />
    ),
  },
  {
    exact: true,
    path: ['/users/create', '/users/:id'],
    private: true,
    resources: [
      {
        name: Resource.USER,
        actions: [Action.CREATE, Action.READ, Action.UPDATE],
      },
    ],
    pageTitle: 'TITLE_MANAGE_USERS',
    component: ({ match, history }: RouteComponentProps<{ id: string }>) => (
      <UserDetails match={match} history={history} />
    ),
  },
  {
    exact: true,
    path: '/users/info/:id',
    private: true,
    resources: [
      {
        name: Resource.USER,
        actions: [Action.READ],
      },
    ],
    pageTitle: 'TITLE_MANAGE_USERS',
    component: ({ match, history }: RouteComponentProps) => <UserInfo />,
  },
];
const roleRoutes: AppRoute[] = [
  {
    exact: true,
    path: '/roles',
    private: true,
    resources: [
      {
        name: Resource.ROLE,
        actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
      },
    ],
    pageTitle: 'TITLE_ROLE_AVAILABLE',
    component: ({ match, history }: RouteComponentProps) => (
      <ManageRoles history={history} />
    ),
  },
  {
    exact: true,
    path: '/roles-need-approve',
    private: true,
    resources: [
      {
        name: Resource.ROLE,
        actions: [Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE],
      },
    ],
    pageTitle: 'TITLE_ROLE_NEED_APPROVE',
    component: ({ match, history }: RouteComponentProps) => (
      <RoleNeedApprove history={history} />
    ),
  },
  {
    exact: true,
    path: ['/roles/create', '/roles/:id'],
    private: true,
    resources: [
      {
        name: Resource.ROLE,
        actions: [Action.CREATE, Action.READ, Action.UPDATE],
      },
    ],
    pageTitle: 'TITLE_MANAGE_ROLES',
    component: ({ match, history }: RouteComponentProps<{ id: string }>) => (
      <RoleDetails match={match} history={history} />
    ),
  },
];
const sentenceRoutes: AppRoute[] = [
  {
    exact: true,
    path: '/import-sentences',
    private: true,
    resources: [],
    hasPermission: true,
    pageTitle: 'TITLE_IMPORT_SENTENCE',
    component: ({ history }: RouteComponentProps) => (
      <ImportSentences history={history} />
    ),
  },
  {
    exact: true,
    path: '/sentences',
    private: true,
    resources: [
      {
        name: Resource.SENTENCE,
        actions: [Action.READ, Action.CREATE, Action.UPDATE],
      },
    ],
    hasPermission: true,
    pageTitle: 'TITLE_MANAGE_SENTENCES',
    component: ({ history }: RouteComponentProps) => (
      <ManageSentences history={history} />
    ),
  },
  {
    exact: true,
    path: '/sentences/:id',
    private: true,
    resources: [
      {
        name: Resource.SENTENCE,
        actions: [Action.READ, Action.UPDATE],
      },
    ],
    hasPermission: true,
    pageTitle: 'TITLE_EDIT_SENTENCE',
    component: ({ history, match }: RouteComponentProps<{ id: string }>) => (
      <SentenceDetails history={history} match={match} />
    ),
  },
];
const recordRoutes: AppRoute[] = [
  {
    exact: true,
    path: '/import-records',
    private: true,
    resources: [],
    hasPermission: true,
    pageTitle: 'TITLE_IMPORT_RECORD',
    component: ({ history }: RouteComponentProps) => (
      <ImportRecords history={history} />
    ),
  },
  {
    exact: true,
    path: '/records',
    private: true,
    resources: [
      {
        name: Resource.RECORD,
        actions: [Action.READ, Action.CREATE, Action.UPDATE],
      },
    ],
    hasPermission: true,
    pageTitle: 'TITLE_MANAGE_RECORDS',
    component: ({ history }: RouteComponentProps) => (
      <ManageRecords history={history} />
    ),
  },
  {
    exact: true,
    path: '/records/:id',
    private: true,
    resources: [
      {
        name: Resource.RECORD,
        actions: [Action.READ, Action.UPDATE],
      },
    ],
    hasPermission: true,
    pageTitle: 'TITLE_EDIT_RECORD',
    component: ({ history, match }: RouteComponentProps<{ id: string }>) => (
      <RecordDetails history={history} match={match} />
    ),
  },
];
const broadcasterRoutes: AppRoute[] = [];
const defaultRoutes: AppRoute[] = [
  {
    exact: true,
    path: '/settings',
    private: true,
    resources: [],
    hasPermission: true,
    pageTitle: 'ACTIONS_SETTINGS',
    component: ({ match, history }: RouteComponentProps) => (
      <Settings match={match} history={history} />
    ),
  },
  {
    exact: true,
    path: '/not-found',
    private: false,
    resources: [],
    hasPermission: true,
    pageTitle: 'PAGE_TITLE_NOT_FOUND',
    component: NotFoundPage,
  },
  {
    exact: true,
    path: '/unauthorized',
    private: true,
    resources: [],
    hasPermission: true,
    pageTitle: 'PAGE_TITLE_UNAUTHORIZE',
    component: UnauthorizedPage,
  },
];

const routes: AppRoute[] = [
  ...dashboardRoutes,
  ...userRoutes,
  ...roleRoutes,
  ...sentenceRoutes,
  ...recordRoutes,
  ...broadcasterRoutes,
  ...defaultRoutes,
];

export default routes;
