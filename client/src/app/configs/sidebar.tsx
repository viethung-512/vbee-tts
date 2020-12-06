import React from 'react';

import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import SecurityIcon from '@material-ui/icons/Security';
import SettingsIcon from '@material-ui/icons/Settings';
import DescriptionIcon from '@material-ui/icons/Description';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import SpeakerGroupIcon from '@material-ui/icons/SpeakerGroup';
import FileCopyIcon from '@material-ui/icons/FileCopy';

export interface SidebarItem {
  label: string;
  name: string;
  permission: boolean;
  path?: string;
  icon?: React.ReactNode;
  children?: {
    label: string;
    name: string;
    path: string;
    permission: boolean;
  }[];
}

export interface SidebarMenu {
  name: string;
  data: SidebarItem[];
}

const overviewMenu: SidebarMenu = {
  name: 'TITLE_OVERVIEW',
  data: [
    {
      label: 'TITLE_DASHBOARD',
      name: '/dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      permission: true,
    },
  ],
};

const featuresMenu: SidebarMenu = {
  name: 'TITLE_FEATURES',
  data: [
    {
      label: 'TITLE_MANAGE_PRE_RECORD',
      name: 'manage_pre_record',
      icon: <DescriptionIcon />,
      permission: true,
      children: [
        {
          label: 'TITLE_IMPORT_SENTENCE',
          name: '/import-sentences',
          path: '/import-sentences',
          permission: true,
        },
        {
          label: 'TITLE_MANAGE_SENTENCES',
          name: '/sentences',
          path: '/sentences',
          permission: true,
        },
      ],
    },
    {
      label: 'TITLE_MANAGE_AFTER_RECORD',
      name: 'manage_after_record',
      icon: <FileCopyIcon />,
      permission: true,
      children: [
        {
          label: 'TITLE_IMPORT_RECORD',
          name: '/import-records',
          path: '/import-records',
          permission: true,
        },
        {
          label: 'TITLE_MANAGE_RECORDS',
          name: '/records',
          path: '/records',
          permission: true,
        },
      ],
    },
    {
      label: 'TITLE_MANAGE_RECORDERS',
      name: 'manage_recorder',
      icon: <SpeakerGroupIcon />,
      permission: true,
      children: [
        {
          label: 'TITLE_MANAGE_VOICES',
          name: '/voices',
          path: '/voices',
          permission: true,
        },
        {
          label: 'TITLE_MANAGE_BROADCASTERS',
          name: '/broadcasters',
          path: '/broadcasters',
          permission: true,
        },
      ],
    },
  ],
};

const authMenu: SidebarMenu = {
  name: 'TITLE_AUTHENTICATION',
  data: [
    {
      label: 'TITLE_MANAGE_USERS',
      name: '/users',
      path: '/users',
      icon: <PeopleAltIcon />,
      permission: true,
    },
    {
      label: 'TITLE_MANAGE_ROLES',
      name: 'manage_role',
      icon: <SecurityIcon />,
      permission: true,
      children: [
        {
          label: 'TITLE_ROLE_AVAILABLE',
          name: '/roles',
          path: '/roles',
          permission: true,
        },
        {
          label: 'TITLE_ROLE_NEED_APPROVE',
          name: '/roles-need-approve',
          path: '/roles-need-approve',
          permission: true,
        },
      ],
    },
  ],
};

const broadcasterMenu: SidebarMenu = {
  name: 'MODEL_BROADCASTER',
  data: [
    {
      label: 'MODEL_BROADCASTER',
      name: '/broadcaster-record',
      path: '/broadcaster-record',
      icon: <RecordVoiceOverIcon />,
      permission: true,
    },
  ],
};

const settingMenu: SidebarMenu = {
  name: 'ACTIONS_SETTINGS',
  data: [
    {
      label: 'ACTIONS_SETTINGS',
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
  settingMenu,
];

export const sidebarWidth = 270;
export const sidebarMinWidth = 73;

export default menus;
