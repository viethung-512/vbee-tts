import React from 'react';
import { useTranslation } from 'react-i18next';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import SecurityIcon from '@material-ui/icons/Security';
import SettingsIcon from '@material-ui/icons/Settings';
import DescriptionIcon from '@material-ui/icons/Description';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import SpeakerGroupIcon from '@material-ui/icons/SpeakerGroup';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SettingsVoiceIcon from '@material-ui/icons/SettingsVoice';

import usePermission from 'hooks/usePermission';
import { SidebarMenu } from 'app/configs/sidebar';

function useSidebar() {
  const { t }: { t: any } = useTranslation();
  const {
    isRootUser,
    isBroadcaster,
    canReadUser,
    canReadRole,
    canReadSentence,
    canReadRecord,
  } = usePermission();

  const overviewMenu: SidebarMenu = {
    name: t('TITLE_OVERVIEW'),
    data: [
      {
        label: t('TITLE_DASHBOARD'),
        name: '/dashboard',
        path: '/dashboard',
        icon: <DashboardIcon />,
        permission: true,
      },
    ],
  };

  const featuresMenu: SidebarMenu = {
    name: t('TITLE_FEATURES'),
    data: [
      {
        label: t('TITLE_MANAGE_PRE_RECORD'),
        name: 'manage_pre_record',
        icon: <DescriptionIcon />,
        permission: true,
        children: [
          {
            label: t('TITLE_IMPORT_SENTENCE'),
            name: '/import-sentences',
            path: '/import-sentences',
            permission: isRootUser,
          },
          {
            label: t('TITLE_MANAGE_SENTENCES'),
            name: '/sentences',
            path: '/sentences',
            permission: canReadSentence,
          },
        ],
      },
      {
        label: t('TITLE_MANAGE_AFTER_RECORD'),
        name: 'manage_after_record',
        icon: <FileCopyIcon />,
        permission: true,
        children: [
          {
            label: t('TITLE_IMPORT_RECORD'),
            name: '/import-records',
            path: '/import-records',
            permission: isRootUser,
          },
          {
            label: t('TITLE_MANAGE_RECORDS'),
            name: '/records',
            path: '/records',
            permission: canReadRecord,
          },
        ],
      },
      {
        label: t('TITLE_MANAGE_RECORDERS'),
        name: 'manage_recorder',
        icon: <SpeakerGroupIcon />,
        permission: isRootUser,
        children: [
          {
            label: t('TITLE_MANAGE_VOICES'),
            name: '/voices',
            path: '/voices',
            permission: isRootUser,
          },
          {
            label: t('TITLE_MANAGE_BROADCASTERS'),
            name: '/broadcasters',
            path: '/broadcasters',
            permission: isRootUser,
          },
        ],
      },
      {
        label: t('SIDEBAR_MENU_ITEM__MANAGE_TRAINING'),
        name: 'manage_trainings',
        // path: '/trainings',
        icon: <SettingsVoiceIcon />,
        permission: isRootUser,
        children: [
          {
            label: t('SIDEBAR_MENU_ITEM__TRAINING'),
            name: '/trainings',
            path: '/trainings',
            permission: isRootUser,
          },
          {
            label: t('SIDEBAR_MENU_ITEM__TRAINING_HISTORY'),
            name: '/trainings/history',
            path: '/trainings/history',
            permission: isRootUser,
          },
        ],
      },
    ],
  };

  const authMenu: SidebarMenu = {
    name: t('TITLE_AUTHENTICATION'),
    data: [
      {
        label: t('TITLE_MANAGE_USERS'),
        name: '/users',
        path: '/users',
        icon: <PeopleAltIcon />,
        permission: canReadUser,
      },
      {
        label: t('TITLE_MANAGE_ROLES'),
        name: 'manage_role',
        icon: <SecurityIcon />,
        permission: true,
        children: [
          {
            label: t('TITLE_ROLE_AVAILABLE'),
            name: '/roles',
            path: '/roles',
            permission: canReadRole,
          },
          {
            label: t('TITLE_ROLE_NEED_APPROVE'),
            name: '/roles-need-approve',
            path: '/roles-need-approve',
            permission: isRootUser,
          },
        ],
      },
    ],
  };

  const broadcasterMenu: SidebarMenu = {
    name: t('MODEL_BROADCASTER'),
    data: [
      {
        label: t('MODEL_BROADCASTER'),
        name: '/broadcaster-record',
        path: '/broadcaster-record',
        icon: <RecordVoiceOverIcon />,
        permission: isBroadcaster,
      },
    ],
  };

  const settingMenu: SidebarMenu = {
    name: t('ACTIONS_SETTINGS'),
    data: [
      {
        label: t('ACTIONS_SETTINGS'),
        name: '/settings',
        path: '/settings',
        icon: <SettingsIcon />,
        permission: true,
      },
    ],
  };

  const menus = [
    overviewMenu,
    featuresMenu,
    authMenu,
    broadcasterMenu,
    // trainingMenu,
    settingMenu,
  ];

  const getMenuSelected = (pathSelected: string): Record<string, boolean> => {
    let array: any[] = [];

    menus.forEach(s => {
      s.data.forEach(d => {
        if (d.children && d.children.length > 0) {
          array.push(...d.children);
        } else {
          array.push(d);
        }
      });
    });

    const match = array.find(a => a.name === pathSelected);
    if (!match) {
      return {};
    }

    return { [match.name]: true };
  };

  return { sidebarMenus: menus, getMenuSelected };
}

export default useSidebar;
