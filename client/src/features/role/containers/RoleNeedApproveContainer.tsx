import React, { useState, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import MaterialTable, {
  Action as MTAction,
  Column as MTColumn,
} from 'material-table';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';
import LoadingBar from 'react-top-loading-bar';

import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import useAlert from 'hooks/useAlert';
import useAsync from 'hooks/useAsync';
import useModal from 'hooks/useModal';
import useLocalization from 'hooks/useLocalization';
import usePermission from 'hooks/usePermission';

import { materialTableOptions } from 'app/configs/material-table';
import roleAPI from 'app/api/roleAPI';
import { Role } from 'app/types/role';

interface RowData extends Role {}

interface Props {
  history: RouteComponentProps['history'];
}

const RoleNeedApproveContainer: React.FC<Props> = ({ history }) => {
  const { materialTable } = useLocalization();
  const { t }: { t: any } = useTranslation();
  const confirm = useConfirm();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { alertSuccess, alertError } = useAlert();
  const { closeModal } = useModal();
  const { canUpdateRole } = usePermission();
  const { ref, startLoading, endLoading } = useAsync();

  const handleApprove = (ids: string[]) => {
    confirm({ description: t('WARNING_APPROVE_ROLE') })
      .then(() => {
        setLoading(true);
        return roleAPI.approveRoles(ids);
      })
      .then(users => {
        console.log(users);
        alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
        closeModal();
        history.push('/roles');

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        alertError(t('MESSAGE_ALERT_ERROR'));
        setLoading(false);
      });
  };

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
        const ids = (data as RowData[]).map(row => row.id);
        handleApprove(ids);
      },
    },
  ];

  return (
    <Fragment>
      <LoadingBar color={theme.palette.secondary.main} ref={ref} />
      <MaterialTable
        columns={columns}
        data={query => {
          return new Promise((resolve, reject) => {
            startLoading();
            roleAPI
              .getRoles({
                search: query.search,
                page: query.page,
                limit: query.pageSize,
              })
              .then(res => {
                resolve({
                  data: res.docs.filter(doc => doc.policy.draft_version),
                  page: res.page,
                  totalCount: res.totalDocs,
                });
              })
              .catch(err => {
                reject(err);
              })
              .finally(() => {
                endLoading();
              });
          });
        }}
        actions={actions}
        options={{ ...materialTableOptions, selection: canUpdateRole }}
        localization={materialTable}
        isLoading={loading}
      />
    </Fragment>
  );
};

export default RoleNeedApproveContainer;
