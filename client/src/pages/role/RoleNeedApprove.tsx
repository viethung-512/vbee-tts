import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import RoleNeedApproveContainer from 'features/role/containers/RoleNeedApproveContainer';
import { Role } from 'app/types/role';

interface Props {
  history: RouteComponentProps['history'];
}

export interface RowData extends Role {}

const RoleNeedApprove: React.FC<Props> = ({ history }) => {
  return (
    <div>
      <RoleNeedApproveContainer history={history} />
    </div>
  );
};

export default RoleNeedApprove;
