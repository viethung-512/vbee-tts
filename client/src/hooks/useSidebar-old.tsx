import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import SecurityIcon from '@material-ui/icons/Security';
// import SettingsIcon from '@material-ui/icons/Settings';
// import DescriptionIcon from '@material-ui/icons/Description';
// import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
// import SpeakerGroupIcon from '@material-ui/icons/SpeakerGroup';
// import FileCopyIcon from '@material-ui/icons/FileCopy';

import usePermission from 'hooks/usePermission';

export interface SidebarItem {
  value: string;
  label: string;
  path?: string;
  icon?: React.ReactElement;
  allowAccess?: boolean | null;
  items?: SidebarItem[];
}

export interface SidebarMenu {
  name: string;
  data: SidebarItem[];
}

const getSelected = (pathname: string) => {
  if (pathname === '/') {
    return 'dashboard';
  }
  if (pathname.includes('/users')) {
    return 'manage-users';
  }
  if (pathname.includes('/roles')) {
    return 'manage-roles';
  }
  if (pathname.includes('/sentences')) {
    return 'manage-sentences';
  }
  if (pathname.includes('/broadcasters')) {
    return 'manage-broadcasters';
  }
  if (pathname.includes('/broadcaster-recording')) {
    return 'broadcaster-sentences';
  }
  if (pathname.includes('/records')) {
    return 'manage-records';
  }
  if (pathname.includes('/broadcaster-sentences')) {
    return 'broadcaster-record';
  }

  return pathname.split('/')[1];
};

const getOpening = (selected: string, menus: SidebarMenu[]) => {
  const menusHasChild = menus.find(menu =>
    menu.data.some(item => {
      return (
        item.items &&
        item.items.length > 0 &&
        item.items.some(it => it.value === selected)
      );
    })
  );

  if (!menusHasChild) {
    return '';
  }

  return menusHasChild.data.find(
    item => item.items && item.items.some(it => it.value === selected)
  )!.value;

  // return menusHasChild.data.find(
  //   item => item.items && item.items.some(it => it.value === selected)
  // ).value;
};

const useSidebar = ({ drawerOpen }: { drawerOpen: boolean }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [opening, setOpening] = useState('');
  const [selected, setSelected] = useState('');

  const {
    isRootUser,
    // isBroadcaster,
    canReadUser,
    canReadRole,
    // canReadSentence,
    // canReadRecord,
  } = usePermission();

  useEffect(() => {
    if (!drawerOpen) {
      setOpening('');
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (location.pathname) {
      const currentSelected = getSelected(location.pathname);
      const currentOpening = getOpening(currentSelected, menus);

      setSelected(currentSelected);
      setOpening(currentOpening);
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  const handleParentClick = (isWrapper: boolean, itemValue: string) => {
    if (opening === itemValue) {
      setOpening('');
    } else {
      setOpening(itemValue);
    }

    if (!isWrapper) {
      setSelected(itemValue);
    }
  };

  const handleChildrenClick = (isNested: boolean, itemValue: string) => {
    setSelected(itemValue);
    if (!isNested) {
      setOpening('');
    }
  };

  const overviewMenu: SidebarItem[] = [
    {
      value: 'dashboard',
      label: t('TITLE_DASHBOARD'),
      path: '/dashboard',
      icon: <DashboardIcon />,
      allowAccess: true,
    },
  ];

  // const settingMenu = [
  //   {
  //     value: 'settings',
  //     label: t('ACTIONS_SETTINGS'),
  //     path: '/settings',
  //     icon: <SettingsIcon />,
  //     allowAccess: true,
  //   },
  // ];

  const authMenu = [
    {
      value: 'manage-users',
      label: t('TITLE_MANAGE_USERS'),
      path: '/manage-users',
      icon: <PeopleAltIcon />,
      allowAccess: canReadUser,
    },
    {
      value: 'roles',
      label: t('TITLE_MANAGE_ROLES'),
      icon: <SecurityIcon />,
      allowAccess: canReadRole,
      items: [
        {
          value: 'manage-roles',
          label: t('TITLE_ROLE_AVAILABLE'),
          path: '/manage-roles',
          allowAccess: canReadRole,
        },
        {
          value: 'role-need-approve',
          label: t('TITLE_ROLE_NEED_APPROVE'),
          path: '/role-need-approve',
          allowAccess: isRootUser,
        },
      ],
    },
  ];

  // const featuresMenu: SidebarItem[] = [
  //   {
  //     value: 'manage-pre-record',
  //     label: t('TITLE_MANAGE_PRE_RECORD'),
  //     icon: <DescriptionIcon />,
  //     allowAccess: canReadSentence,
  //     items: [
  //       {
  //         value: 'import-sentences',
  //         label: t('TITLE_IMPORT_SENTENCE'),
  //         path: '/import-sentences',
  //         allowAccess: isRootUser,
  //       },
  //       {
  //         value: 'manage-sentences',
  //         label: t('TITLE_MANAGE_SENTENCES'),
  //         path: '/manage-sentences',
  //         allowAccess: canReadSentence,
  //       },
  //     ],
  //   },
  //   {
  //     value: 'manage-after-record',
  //     label: t('TITLE_MANAGE_AFTER_RECORD'),
  //     icon: <FileCopyIcon />,
  //     allowAccess: canReadRecord,
  //     items: [
  //       {
  //         value: 'import-records',
  //         label: t('TITLE_IMPORT_RECORD'),
  //         path: '/import-records',
  //         allowAccess: isRootUser,
  //       },
  //       {
  //         value: 'manage-records',
  //         label: t('TITLE_MANAGE_RECORDS'),
  //         path: '/manage-records',
  //         allowAccess: canReadRecord,
  //       },
  //     ],
  //   },
  //   {
  //     value: 'manage-recorders',
  //     label: t('TITLE_MANAGE_RECORDERS'),
  //     icon: <SpeakerGroupIcon />,
  //     allowAccess: isRootUser,
  //     items: [
  //       {
  //         value: 'manage-voices',
  //         label: t('TITLE_MANAGE_VOICES'),
  //         path: '/manage-voices',
  //         allowAccess: isRootUser,
  //       },
  //       {
  //         value: 'manage-broadcasters',
  //         label: t('TITLE_MANAGE_BROADCASTERS'),
  //         path: '/manage-broadcasters',
  //         allowAccess: canReadSentence,
  //       },
  //     ],
  //   },
  // ];

  // const broadcasterMenu: SidebarItem[] = [
  //   {
  //     value: 'broadcaster-record',
  //     label: t('MODEL_BROADCASTER'),
  //     path: '/broadcaster-record',
  //     icon: <RecordVoiceOverIcon />,
  //     allowAccess: isBroadcaster,
  //   },
  // ];

  const menus: SidebarMenu[] = [
    { name: t('TITLE_OVERVIEW'), data: overviewMenu },
    // { name: t('TITLE_FEATURES'), data: featuresMenu },
    { name: t('TITLE_AUTHENTICATION'), data: authMenu },
    // { name: t('MODEL_BROADCASTER'), data: broadcasterMenu },
    // { name: t('ACTIONS_SETTINGS'), data: settingMenu },
  ];

  return {
    selected,
    opening,
    menus,
    handleChildrenClick,
    handleParentClick,
  };
};

export default useSidebar;
