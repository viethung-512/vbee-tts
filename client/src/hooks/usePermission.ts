import { useSelector } from 'react-redux';
import { Resource, Action, canAccessResource, rootRole } from '@tts-dev/common';
import { AppState, AuthState } from 'app/redux/rootReducer';

const usePermission = () => {
  const { user: authUser } = useSelector<AppState, AuthState>(
    state => state.auth
  );

  const isRootUser =
    authUser && authUser.role && authUser.role.name === rootRole.name;
  // const isBroadcaster = authUser && authUser.isBroadcaster;

  // TODO: need to update
  const isBroadcaster = false;

  const canCreateUser = canAccessResource(
    authUser!,
    Resource.USER,
    Action.CREATE
  );
  const canReadUser = canAccessResource(authUser!, Resource.USER, Action.READ);
  const canUpdateUser = canAccessResource(
    authUser!,
    Resource.USER,
    Action.UPDATE
  );
  const canDeleteUser = canAccessResource(
    authUser!,
    Resource.USER,
    Action.DELETE
  );

  const canCreateRole = canAccessResource(
    authUser!,
    Resource.ROLE,
    Action.CREATE
  );
  const canReadRole = canAccessResource(authUser!, Resource.ROLE, Action.READ);
  const canUpdateRole = canAccessResource(
    authUser!,
    Resource.ROLE,
    Action.UPDATE
  );
  const canDeleteRole = canAccessResource(
    authUser!,
    Resource.ROLE,
    Action.DELETE
  );

  const canCreateSentence = canAccessResource(
    authUser!,
    Resource.SENTENCE,
    Action.CREATE
  );
  const canReadSentence = canAccessResource(
    authUser!,
    Resource.SENTENCE,
    Action.READ
  );
  const canUpdateSentence = canAccessResource(
    authUser!,
    Resource.SENTENCE,
    Action.UPDATE
  );
  const canDeleteSentence = canAccessResource(
    authUser!,
    Resource.SENTENCE,
    Action.DELETE
  );

  const canCreateRecord = canAccessResource(
    authUser!,
    Resource.RECORD,
    Action.CREATE
  );
  const canReadRecord = canAccessResource(
    authUser!,
    Resource.RECORD,
    Action.READ
  );
  const canUpdateRecord = canAccessResource(
    authUser!,
    Resource.RECORD,
    Action.UPDATE
  );
  const canDeleteRecord = canAccessResource(
    authUser!,
    Resource.RECORD,
    Action.DELETE
  );

  return {
    isRootUser,
    isBroadcaster,
    canCreateUser,
    canReadUser,
    canUpdateUser,
    canDeleteUser,
    canCreateRole,
    canReadRole,
    canUpdateRole,
    canDeleteRole,
    canCreateSentence,
    canReadSentence,
    canUpdateSentence,
    canDeleteSentence,
    canCreateRecord,
    canReadRecord,
    canUpdateRecord,
    canDeleteRecord,
  };
};

export default usePermission;
