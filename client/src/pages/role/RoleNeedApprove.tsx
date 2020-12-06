import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Action as MTAction, Column as MTColumn } from 'material-table';

import Chip from '@material-ui/core/Chip';

import useModal from 'hooks/useModal';
import usePermission from 'hooks/usePermission';
import { materialTableOptions } from 'app/configs/material-table';
import Confirms from 'features/role/Confirms';
import { modalActionTypes } from 'app/utils/constants';

import RoleNeedApproveContainer from 'features/role/containers/RoleNeedApproveContainer';
import { Role } from 'app/types/role';

interface Props {
  history: RouteComponentProps['history'];
}

export interface RowData extends Role {}

const RoleNeedApprove: React.FC<Props> = ({ history }) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { canUpdateRole } = usePermission();

  const policyMarkup = (rowData: RowData) => (
    <Chip
      label={rowData.policy.draft_version}
      size='small'
      style={{
        fontFamily: "'Fira Code', monospace",
        fontSize: '0.875rem',
        borderRadius: 4,
      }}
    />
  );

  const columns: MTColumn<RowData>[] = [
    {
      title: t('MODEL_ROLE'),
      field: 'name',
      width: 200,
    },
    {
      title: t('FIELDS_SENTENCE_POLICY'),
      field: 'draft_policy',
      render: policyMarkup,
    },
  ];

  const actions: MTAction<RowData>[] = [
    {
      tooltip: t('ACTIONS_APPROVE_ALL_ROLE'),
      icon: 'check',
      onClick: (evt, data) => {
        const roleIds = (data as RowData[]).map(row => row.id);

        openModal('ConfirmModal', {
          data: { ids: roleIds },
          type: modalActionTypes.APPROVE_ROLE,
        });
      },
    },
  ];

  return (
    <div>
      <RoleNeedApproveContainer
        actions={actions}
        columns={columns}
        options={{ ...materialTableOptions, selection: canUpdateRole }}
      />
      <Confirms />
    </div>
  );
};

export default RoleNeedApprove;
