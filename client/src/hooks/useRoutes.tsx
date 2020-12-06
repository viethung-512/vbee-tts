import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// import AdminInfoPage from 'features/dashboard/admin/Admin';
// import BasicUserInfoPage from 'features/dashboard/basic-user/BasicUser';
// import ManageUserPage from 'features/user/manage-user/ManageUser';
// import UserDetailsPage from 'features/user/user-details/UserDetails';
// import ManageRolePage from 'features/role/manage-role/ManageRole';
// import RoleDetails from 'features/role/role-details/RoleDetails';
// import WaitingForApproveRolePage from 'features/role/manage-role/WaitingForApprove';
// import ImportSentencesPage from 'features/sentence/import-sentence/ImportSentencesPage';
// import ManageSentencePage from 'features/sentence/manage-sentence/ManageSentence';
// import SentenceDetailsPage from 'features/sentence/sentence-details/SentenceDetails';
// import SettingsPage from 'features/settings/Settings';
// import BroadcasterRecord from 'features/broadcaster/broadcaster-sentences/BroadcasterRecord';
// import ManageVoices from 'features/voice/manage-voices/ManageVoices';
// import ManageBroadcasters from 'features/broadcaster/manage-broadcasters/ManageBroadcasters';
// import BroadcasterSentence from 'features/broadcaster/broadcaster-sentences/BroadcasterSentence';
// import BroadcasterDetails from 'features/broadcaster/broadcaster-details/BroadcasterDetails';
// import ImportRecordPage from 'features/record/import-record/ImportRecord';
// import ManageRecordPage from 'features/record/manage-record/ManageRecord';
// import RecordDetailsPage from 'features/record/record-details/RecordDetails';
// import UnauthorizedPage from 'app/layout/pages/UnAuthorizedPage';
// import NotFoundPage from 'app/layout/pages/NotFoundPage';

// import usePermission from 'hooks/usePermission';

interface RouteItem {
  exact: boolean;
  path: string;
  component: React.FC<RouteComponentProps>;
  isPrivate: boolean;
  hasPermission?: boolean | null;
  label?: string;
}

function useRoutes() {
  // const location = useLocation();
  // const { t } = useTranslation();
  // const {
  //   isBroadcaster,
  //   isRootUser,
  //   canReadRole,
  //   canReadSentence,
  //   canReadUser,
  //   canReadRecord,
  //   canUpdateSentence,
  //   canUpdateRecord,
  // } = usePermission();

  // const dashboardRoutes: RouteItem[] = [
  //   {
  //     exact: true,
  //     path: '/',
  //     component: () => <Redirect to='/dashboard' />,
  //     isPrivate: true,
  //     hasPermission: true,
  //   },
  //   {
  //     exact: true,
  //     path: '/dashboard',
  //     label: t('TITLE_DASHBOARD'),
  //     component: () => {
  //       if (isRootUser) {
  //         return <AdminInfoPage />;
  //       }
  //       return <BasicUserInfoPage />;
  //     },
  //     isPrivate: true,
  //     hasPermission: true,
  //   },
  // ];

  // const userRoutes: RouteItem[] = [
  //   {
  //     exact: true,
  //     path: '/manage-users',
  //     label: t('TITLE_MANAGE_USERS'),
  //     component: ({ history }) => <ManageUserPage history={history} />,
  //     isPrivate: true,
  //     hasPermission: canReadUser,
  //   },
  //   {
  //     exact: true,
  //     path: '/users/create',
  //     label: t('TITLE_MANAGE_USERS'),
  //     component: ({ history, match }) => (
  //       <UserDetailsPage history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: canReadUser,
  //   },
  //   {
  //     exact: true,
  //     path: '/users/:id',
  //     label: t('TITLE_MANAGE_USERS'),
  //     component: ({ history, match }) => (
  //       <UserDetailsPage history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: canReadUser,
  //   },
  //   {
  //     exact: true,
  //     path: '/users/info/:id',
  //     label: t('TITLE_MANAGE_USERS'),
  //     component: ({ history, match }) => (
  //       <BasicUserInfoPage history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: canReadUser,
  //   },
  // ];

  // const roleRoutes: RouteItem[] = [
  //   {
  //     exact: true,
  //     path: '/manage-roles',
  //     label: t('TITLE_ROLE_AVAILABLE'),
  //     component: ({ history, match }) => (
  //       <ManageRolePage history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: canReadRole,
  //   },
  //   {
  //     exact: true,
  //     path: '/role-need-approve',
  //     label: t('TITLE_ROLE_NEED_APPROVE'),
  //     component: ({ history }) => (
  //       <WaitingForApproveRolePage history={history} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: isRootUser,
  //   },
  //   {
  //     exact: true,
  //     path: '/roles/create',
  //     label: t('TITLE_MANAGE_ROLES'),
  //     component: ({ history, match }) => (
  //       <RoleDetails history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: canReadRole,
  //   },
  //   {
  //     exact: true,
  //     path: '/roles/:id',
  //     label: t('TITLE_MANAGE_ROLES'),
  //     component: ({ history, match }) => (
  //       <RoleDetails history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: canReadRole,
  //   },
  // ];

  // const sentenceRoutes: RouteItem[] = [
  //   {
  //     exact: true,
  //     path: '/import-sentences',
  //     label: t('TITLE_IMPORT_SENTENCE'),
  //     component: ({ history }) => <ImportSentencesPage history={history} />,
  //     isPrivate: true,
  //     hasPermission: isRootUser,
  //   },
  //   {
  //     exact: true,
  //     path: '/manage-sentences',
  //     label: t('TITLE_MANAGE_SENTENCES'),
  //     component: ({ history }) => <ManageSentencePage history={history} />,
  //     isPrivate: true,
  //     hasPermission: canReadSentence,
  //   },
  //   {
  //     exact: true,
  //     path: '/sentences/:id',
  //     label: t('TITLE_EDIT_SENTENCE'),
  //     component: ({ history, match }) => (
  //       <SentenceDetailsPage history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: canReadSentence && canUpdateSentence,
  //   },
  // ];

  // const recordRoutes: RouteItem[] = [
  //   {
  //     exact: true,
  //     path: '/import-records',
  //     label: t('TITLE_IMPORT_RECORD'),
  //     component: ({ history }) => <ImportRecordPage history={history} />,
  //     isPrivate: true,
  //     hasPermission: isRootUser,
  //   },
  //   {
  //     exact: true,
  //     path: '/manage-records',
  //     label: t('TITLE_MANAGE_RECORDS'),
  //     component: ({ history }) => <ManageRecordPage history={history} />,
  //     isPrivate: true,
  //     hasPermission: canReadRecord,
  //   },
  //   {
  //     exact: true,
  //     path: '/records/:id',
  //     label: t('TITLE_EDIT_RECORD'),
  //     component: ({ history, match }) => (
  //       <RecordDetailsPage history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: canUpdateRecord,
  //   },
  // ];

  // const broadcasterRoutes: RouteItem[] = [
  //   {
  //     exact: true,
  //     path: '/broadcaster-record',
  //     label: t('TITLE_BROADCASTER'),
  //     component: ({ history }) => <BroadcasterRecord history={history} />,
  //     isPrivate: true,
  //     hasPermission: isBroadcaster,
  //   },
  //   {
  //     exact: true,
  //     path: '/broadcaster-sentences/:id',
  //     label: t('TITLE_BROADCASTER'),
  //     component: ({ history, match }) => (
  //       <BroadcasterSentence history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: isBroadcaster,
  //   },
  //   {
  //     exact: true,
  //     path: '/manage-voices',
  //     label: t('TITLE_MANAGE_VOICES'),
  //     component: ({ history }) => <ManageVoices history={history} />,
  //     isPrivate: true,
  //     hasPermission: isRootUser,
  //   },
  //   {
  //     exact: true,
  //     path: '/manage-broadcasters',
  //     label: t('TITLE_MANAGE_BROADCASTERS'),
  //     component: ({ history }) => <ManageBroadcasters history={history} />,
  //     isPrivate: true,
  //     hasPermission: isRootUser,
  //   },
  //   {
  //     exact: true,
  //     path: '/broadcasters/create',
  //     label: t('TITLE_MANAGE_BROADCASTERS'),
  //     component: ({ history, match }) => (
  //       <BroadcasterDetails history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: isRootUser,
  //   },
  //   {
  //     exact: true,
  //     path: '/broadcasters/:id',
  //     label: t('TITLE_MANAGE_BROADCASTERS'),
  //     component: ({ history, match }) => (
  //       <BroadcasterDetails history={history} match={match} />
  //     ),
  //     isPrivate: true,
  //     hasPermission: isRootUser,
  //   },
  // ];

  // const basicRoutes: RouteItem[] = [
  //   {
  //     exact: true,
  //     path: '/settings',
  //     label: t('ACTIONS_SETTINGS'),
  //     component: ({ history, match }) => <SettingsPage />,
  //     isPrivate: true,
  //     hasPermission: true,
  //   },
  //   {
  //     exact: true,
  //     path: '/unauthorized',
  //     label: t('PAGE_TITLE_UNAUTHORIZE'),
  //     component: () => <UnauthorizedPage />,
  //     isPrivate: true,
  //     hasPermission: true,
  //   },
  //   {
  //     exact: true,
  //     path: '/not-found',
  //     label: t('PAGE_TITLE_NOT_FOUND'),
  //     component: () => <NotFoundPage />,
  //     isPrivate: true,
  //     hasPermission: true,
  //   },
  // ];

  // const routes = [
  // ...dashboardRoutes,
  // ...userRoutes,
  // ...roleRoutes,
  // ...sentenceRoutes,
  // ...recordRoutes,
  // ...broadcasterRoutes,
  // ...basicRoutes,
  // ];

  const routes: RouteItem[] = [];

  const getTitle = () => {
    // const page = routes.find(route => {
    //   return route.path.split('/')[1] === location.pathname.split('/')[1];
    // });

    // if (page) {
    //   return page.label;
    // } else {
    //   return t('PAGE_TITLE_DEFAULT');
    // }
    return 'title';
  };

  return { routes, getTitle };
}

export default useRoutes;
