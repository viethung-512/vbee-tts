import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import MaterialTable, { Action, Column } from 'material-table';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';

import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import useAlert from 'hooks/useAlert';
import useDrawer from 'hooks/useDrawer';
import useModal from 'hooks/useModal';
import usePermission from 'hooks/usePermission';
import useLocalization from 'hooks/useLocalization';

import recordAPI from 'app/api/recordAPI';
import StatusTag from 'app/layout/commons/sentence-record/StatusTag';
import StatusFilter from 'app/layout/commons/sentence-record/StatusFilter';
import TypeFilter from 'app/layout/commons/sentence-record/TypeFilter';
import { materialTableOptions } from 'app/configs/material-table';
import { Record } from 'app/types/record';
import { formatUID } from 'app/utils/helper';

interface RowData extends Record {}

interface Props {
  history: RouteComponentProps['history'];
}

const ManageRecordsContainer: React.FC<Props> = ({ history }) => {
  const { materialTable } = useLocalization();
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { isRootUser } = usePermission();
  const { alertSuccess, alertError } = useAlert();
  const { openModal } = useModal();
  const { openDrawer } = useDrawer();
  const confirm = useConfirm();

  const successColor = theme.palette.success.main;
  const errorColor = theme.palette.error.main;

  const handleDelete = (ids: string[]) => {
    confirm({ description: t('WARNING_DELETE_RECORD') })
      .then(() => {
        setLoading(true);
        return recordAPI.deleteRecords(ids);
      })
      .then(sentences => {
        console.log(sentences);
        alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
        history.push('/sentences');

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        alertError(t('MESSAGE_ALERT_ERROR'));
        setLoading(false);
      });
  };

  const handleApprove = (ids: string[]) => {
    confirm({ description: t('WARNING_APPROVE_RECORD') })
      .then(() => {
        setLoading(true);
        return recordAPI.approveRecords(ids);
      })
      .then(sentences => {
        console.log(sentences);
        alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
        history.push('/sentences');

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        alertError(t('MESSAGE_ALERT_ERROR'));
        setLoading(false);
      });
  };

  const voiceMarkup = (rowData: RowData) => (
    <Typography variant='body2'>{rowData?.voice?.code}</Typography>
  );

  const uidMarkup = (rowData: RowData) => (
    <Typography
      variant='body2'
      component={Link}
      to={`/records/${rowData.id}`}
      color='secondary'
      style={{ textDecoration: 'none' }}
    >
      {formatUID(rowData.uid)}
    </Typography>
  );
  const statusMarkup = (rowData: RowData) => (
    <StatusTag statusCode={rowData.status} />
  );

  const actions: Action<RowData>[] = isRootUser
    ? [
        {
          tooltip: t('ACTIONS_ASSIGN'),
          icon: () => <AssignmentIcon color='primary' />,
          onClick: (evt, data) => {
            openModal('AutoAssignRecordsModal');
          },
          isFreeAction: true,
          hidden: !isRootUser,
        },
        {
          tooltip: t('ACTIONS_CHECKING_PROGRESS'),
          icon: () => <PlaylistAddCheckIcon color='secondary' />,
          onClick: (evt, data) => {
            openDrawer('CheckingProgressDrawer', {
              subject: 'record',
            });
          },
          isFreeAction: true,
        },
        {
          tooltip: t('ACTIONS_ASSIGN'),
          icon: () => <AssignmentReturnIcon color='primary' />,
          onClick: (evt, data) => {
            const recordIds = (data as RowData[]).map(item => item.id);
            openModal('AssignRecordsModal', { recordIds });
          },
          hidden: !isRootUser,
        },
        {
          tooltip: t('ACTIONS_DELETE'),
          icon: 'delete',
          iconProps: {
            style: { color: errorColor },
          },
          onClick: (evt, data) => {
            console.log('delete');

            const ids = (data as RowData[]).map(it => it.id);
            handleDelete(ids);
          },
          hidden: !isRootUser,
        },
        {
          tooltip: t('ACTIONS_APPROVE'),
          icon: 'check',
          iconProps: {
            style: { color: successColor },
          },
          onClick: (evt, data) => {
            const ids = (data as RowData[]).map(it => it.id);
            handleApprove(ids);
          },
          hidden: !isRootUser,
        },
      ]
    : [
        {
          tooltip: t('ACTIONS_CHECKING_PROGRESS'),
          icon: () => <PlaylistAddCheckIcon color='secondary' />,
          onClick: (evt, data) => {
            console.log('checking progress');
            openDrawer('CheckingProgressDrawer', {
              model: 'record',
              field: 'progressCheckingRecord',
            });
          },
          isFreeAction: true,
        },
      ];

  const columns: Column<RowData>[] = [
    {
      title: 'UID',
      field: 'uid',
      render: uidMarkup,
      width: 40,
      filtering: false,
    },
    {
      title: t('FIELDS_VOICE_CODE'),
      field: 'voice',
      render: voiceMarkup,
      hidden: !Boolean(isRootUser),
      filtering: false,
    },
    {
      title: t('FIELDS_RECORD_TYPE'),
      field: 'type',
      width: 50,
      filterComponent: props => <TypeFilter {...props} />,
    },
    {
      title: t('FIELDS_RECORD_ORIGINAL'),
      field: 'original',
      filtering: false,
    },
    {
      title: t('STATUS'),
      field: 'status',
      render: statusMarkup,
      width: 140,
      filterComponent: props => <StatusFilter {...props} />,
    },
  ];

  return (
    <MaterialTable
      columns={columns}
      data={query => {
        const filters = query.filters
          .map(f => {
            if (f.value.target.value.length === 0) {
              return null;
            }

            return {
              field: f.column.field,
              data: f.value.target.value,
            };
          })
          .filter(f => f);

        return new Promise((resolve, reject) => {
          recordAPI
            .getRecords(
              {
                search: query.search,
                page: query.page,
                limit: query.pageSize,
              },
              filters
            )
            .then(res => {
              resolve({
                data: res.docs,
                page: res.page,
                totalCount: res.totalDocs,
              });
            })
            .catch(err => {
              reject(err);
            });
        });
      }}
      actions={actions}
      options={{
        ...materialTableOptions,
        padding: 'dense',
        selection: Boolean(isRootUser),
        filtering: true,
        hideFilterIcons: true,
      }}
      localization={materialTable}
      isLoading={loading}
    />
  );
};

export default ManageRecordsContainer;
