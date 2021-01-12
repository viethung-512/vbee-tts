import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import DemoSubscription from 'pages/playground/DemoSubscription';

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
import BroadcasterRecord from 'pages/broadcaster/BroadcasterRecord';
import BroadcasterSentenceDetails from 'pages/broadcaster/BroadcasterSentence';
import ManageTraining from 'pages/training/ManageTraining';
import TrainingHistory from 'pages/training/TrainingHistory';

import Settings from 'pages/auth/Settings';
import ManageVoices from 'pages/voice/ManageVoices';
import BroadcasterDetails from 'pages/broadcaster/BroadcasterDetails';
import ManageBroadcasters from 'pages/broadcaster/ManageBroadcasters';

import usePermission from 'hooks/usePermission';
import { AppRoute } from 'app/configs/routes';

function useRoute() {
  const {
    isRootUser,
    isBroadcaster,
    canReadUser,
    canCreateUser,
    canReadRole,
    canCreateRole,
    canReadSentence,
    canReadRecord,
  } = usePermission();

  const dashboardRoutes: AppRoute[] = [
    {
      exact: true,
      path: '/',
      private: true,
      hasPermission: true,
      pageTitle: 'TITLE_DASHBOARD',
      component: () => <Redirect to='/dashboard' />,
    },
    {
      exact: true,
      path: '/dashboard',
      private: true,
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
      hasPermission: canReadUser,
      pageTitle: 'TITLE_MANAGE_USERS',
      component: ({ match, history }: RouteComponentProps) => (
        <ManageUsers history={history} />
      ),
    },
    {
      exact: true,
      path: '/users/create',
      private: true,
      hasPermission: canCreateUser,
      pageTitle: 'TITLE_MANAGE_USERS',
      component: ({ match, history }: RouteComponentProps<{ id: string }>) => (
        <UserDetails match={match} history={history} />
      ),
    },
    {
      exact: true,
      path: '/users/:id',
      private: true,
      hasPermission: canReadUser,
      pageTitle: 'TITLE_MANAGE_USERS',
      component: ({ match, history }: RouteComponentProps<{ id: string }>) => (
        <UserDetails match={match} history={history} />
      ),
    },
    {
      exact: true,
      path: '/users/info/:id',
      private: true,
      hasPermission: true,
      pageTitle: 'TITLE_MANAGE_USERS',
      component: ({ match, history }: RouteComponentProps) => <UserInfo />,
    },
  ];
  const roleRoutes: AppRoute[] = [
    {
      exact: true,
      path: '/roles',
      private: true,
      hasPermission: canReadRole,
      pageTitle: 'TITLE_ROLE_AVAILABLE',
      component: ({ match, history }: RouteComponentProps) => (
        <ManageRoles history={history} />
      ),
    },
    {
      exact: true,
      path: '/roles-need-approve',
      private: true,
      hasPermission: isRootUser,
      pageTitle: 'TITLE_ROLE_NEED_APPROVE',
      component: ({ match, history }: RouteComponentProps) => (
        <RoleNeedApprove history={history} />
      ),
    },
    {
      exact: true,
      path: '/roles/create',
      private: true,
      hasPermission: canCreateRole,
      pageTitle: 'TITLE_MANAGE_ROLES',
      component: ({ match, history }: RouteComponentProps<{ id: string }>) => (
        <RoleDetails match={match} history={history} />
      ),
    },
    {
      exact: true,
      path: '/roles/:id',
      private: true,
      hasPermission: canReadRole,
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
      hasPermission: isRootUser,
      pageTitle: 'TITLE_IMPORT_SENTENCE',
      component: ({ history }: RouteComponentProps) => (
        <ImportSentences history={history} />
      ),
    },
    {
      exact: true,
      path: '/sentences',
      private: true,
      hasPermission: canReadSentence,
      pageTitle: 'TITLE_MANAGE_SENTENCES',
      component: ({ history }: RouteComponentProps) => (
        <ManageSentences history={history} />
      ),
    },
    {
      exact: true,
      path: '/sentences/:id',
      private: true,
      hasPermission: canReadSentence,
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
      hasPermission: isRootUser,
      pageTitle: 'TITLE_IMPORT_RECORD',
      component: ({ history }: RouteComponentProps) => (
        <ImportRecords history={history} />
      ),
    },
    {
      exact: true,
      path: '/records',
      private: true,
      hasPermission: canReadRecord,
      pageTitle: 'TITLE_MANAGE_RECORDS',
      component: ({ history }: RouteComponentProps) => (
        <ManageRecords history={history} />
      ),
    },
    {
      exact: true,
      path: '/records/:id',
      private: true,
      hasPermission: canReadRecord,
      pageTitle: 'TITLE_EDIT_RECORD',
      component: ({ history, match }: RouteComponentProps<{ id: string }>) => (
        <RecordDetails history={history} match={match} />
      ),
    },
  ];
  const broadcasterRoutes: AppRoute[] = [
    {
      exact: true,
      path: '/voices',
      private: true,
      hasPermission: isRootUser,
      pageTitle: 'TITLE_MANAGE_VOICES',
      component: () => <ManageVoices />,
    },
    {
      exact: true,
      path: '/broadcasters',
      private: true,
      hasPermission: isRootUser,
      pageTitle: 'TITLE_MANAGE_BROADCASTERS',
      component: ({ history }: RouteComponentProps) => (
        <ManageBroadcasters history={history} />
      ),
    },
    {
      exact: true,
      path: '/broadcaster-record',
      private: true,
      hasPermission: isBroadcaster,
      pageTitle: 'TITLE_BROADCASTER',
      component: ({ history }: RouteComponentProps) => (
        <BroadcasterRecord history={history} />
      ),
    },
    {
      exact: true,
      path: '/broadcaster-record/:id',
      private: true,
      hasPermission: isBroadcaster,
      pageTitle: 'TITLE_BROADCASTER',
      component: ({ history, match }: RouteComponentProps<{ id: string }>) => (
        <BroadcasterSentenceDetails history={history} match={match} />
      ),
    },
    {
      exact: true,
      path: '/broadcasters/create',
      private: true,
      hasPermission: isRootUser,
      pageTitle: 'TITLE_MANAGE_BROADCASTERS',
      component: ({ match, history }: RouteComponentProps<{ id: string }>) => (
        <BroadcasterDetails match={match} history={history} />
      ),
    },
    {
      exact: true,
      path: '/broadcasters/:id',
      private: true,
      hasPermission: isRootUser,
      pageTitle: 'TITLE_MANAGE_BROADCASTERS',
      component: ({ match, history }: RouteComponentProps<{ id: string }>) => (
        <BroadcasterDetails match={match} history={history} />
      ),
    },
  ];
  const trainingRoutes: AppRoute[] = [
    {
      exact: true,
      path: '/trainings',
      private: true,
      hasPermission: isRootUser,
      pageTitle: 'PAGE_TITLE__TRAINING',
      component: () => <ManageTraining />,
    },
    {
      exact: true,
      path: '/trainings/history',
      private: true,
      hasPermission: isRootUser,
      pageTitle: 'PAGE_TITLE__TRAINING_HISTORY',
      component: ({ history }: RouteComponentProps) => (
        <TrainingHistory history={history} />
      ),
    },
  ];
  const defaultRoutes: AppRoute[] = [
    {
      exact: true,
      path: '/settings',
      private: true,
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
      hasPermission: true,
      pageTitle: 'PAGE_TITLE_NOT_FOUND',
      component: NotFoundPage,
    },
    {
      exact: true,
      path: '/unauthorized',
      private: true,
      hasPermission: true,
      pageTitle: 'PAGE_TITLE_UNAUTHORIZE',
      component: UnauthorizedPage,
    },
  ];

  const playgroundRoutes: AppRoute[] = [
    {
      exact: true,
      path: '/playground/demo-subscription',
      private: false,
      hasPermission: true,
      pageTitle: 'some page title',
      component: DemoSubscription,
    },
  ];

  const routes: AppRoute[] = [
    ...dashboardRoutes,
    ...userRoutes,
    ...roleRoutes,
    ...sentenceRoutes,
    ...recordRoutes,
    ...broadcasterRoutes,
    ...trainingRoutes,
    ...defaultRoutes,
    ...playgroundRoutes,
  ];

  return { routes };
}

export default useRoute;
