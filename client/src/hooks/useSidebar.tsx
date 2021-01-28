import usePermission from 'hooks/usePermission';

function useSidebar() {
  const {
    isRootUser,
    isBroadcaster,
    canReadUser,
    canReadRole,
    canReadSentence,
    canReadRecord,
  } = usePermission();

  const getPermissionForSidebarItem = (key: string): boolean => {
    switch (key) {
      case 'dashboard':
      case 'manage_pre_record':
      case 'manage_after_record':
      case 'user_settings':
      case 'manage_roles':
        return true;
      case 'import_sentences':
      case 'import_records':
      case 'training':
      case 'manage_recorder':
      case 'manage_voices':
      case 'manage_broadcasters':
      case 'manage_training':
      case 'training_history':
      case 'roles_need_approve':
        return isRootUser;
      case 'manage_sentences':
        return canReadSentence;
      case 'manage_records':
        return canReadRecord;
      case 'manage_users':
        return canReadUser;
      case 'roles_available':
        return canReadRole;
      case 'model_broadcasters':
        return isBroadcaster;
      default:
        return false;
    }
  };

  return { getPermissionForSidebarItem };
}

export default useSidebar;
