import { Menu } from '../configs/sidebar';

const menus: Menu[] = [
  {
    key: 'dashboard',
    name: 'TITLE_DASHBOARD',
    icon: 'dashboard',
    link: '/dashboard',
    permission: true,
  },
  {
    key: 'manage_pre_record',
    name: 'TITLE_MANAGE_PRE_RECORD',
    icon: 'description',
    permission: true,
    child: [
      {
        key: 'import_sentences',
        name: 'TITLE_IMPORT_SENTENCE',
        link: '/import-sentences',
        permission: true,
      },
      {
        key: 'manage_sentences',
        name: 'TITLE_MANAGE_SENTENCES',
        link: '/sentences',
        permission: true,
      },
    ],
  },
  {
    key: 'manage_after_record',
    name: 'TITLE_MANAGE_AFTER_RECORD',
    icon: 'file_copy',
    permission: true,
    child: [
      {
        key: 'import_records',
        name: 'TITLE_IMPORT_RECORD',
        link: '/import-records',
        permission: true,
      },
      {
        key: 'manage_records',
        name: 'TITLE_MANAGE_RECORDS',
        link: '/records',
        permission: true,
      },
    ],
  },
  {
    key: 'manage_recorder',
    name: 'TITLE_MANAGE_RECORDERS',
    icon: 'speaker_group',
    permission: true,
    child: [
      {
        key: 'manage_voices',
        name: 'TITLE_MANAGE_VOICES',
        link: '/voices',
        permission: true,
      },
      {
        key: 'manage_broadcasters',
        name: 'TITLE_MANAGE_BROADCASTERS',
        link: '/broadcasters',
        permission: true,
      },
    ],
  },
  {
    key: 'manage_training',
    name: 'SIDEBAR_MENU_ITEM__MANAGE_TRAINING',
    icon: 'settings_voice',
    permission: true,
    child: [
      {
        key: 'training',
        name: 'SIDEBAR_MENU_ITEM__TRAINING',
        link: '/trainings',
        permission: true,
      },
      {
        key: 'training_history',
        name: 'SIDEBAR_MENU_ITEM__TRAINING_HISTORY',
        link: '/training-history',
        permission: true,
      },
    ],
  },
  {
    key: 'manage_users',
    name: 'TITLE_MANAGE_USERS',
    icon: 'people_alt',
    link: '/users',
    permission: true,
  },
  {
    key: 'manage_roles',
    name: 'TITLE_MANAGE_ROLES',
    icon: 'admin_panel_settings',
    permission: true,
    child: [
      {
        key: 'roles_available',
        name: 'TITLE_ROLE_AVAILABLE',
        link: '/roles',
        permission: true,
      },
      {
        key: 'roles_need_approve',
        name: 'TITLE_ROLE_NEED_APPROVE',
        link: '/role-need-approve',
        permission: true,
      },
    ],
  },
  {
    key: 'model_broadcasters',
    name: 'MODEL_BROADCASTER',
    icon: 'record_voice_over',
    link: '/broadcaster-record',
    permission: true,
  },
];

const otherMenu: Menu[] = [
  {
    key: 'user_settings',
    name: 'ACTIONS_SETTINGS',
    icon: 'settings',
    link: '/settings',
    permission: true,
  },
];

export { menus, otherMenu };
