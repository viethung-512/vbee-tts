import React, { useState, Fragment } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import MaterialTable, { Action, Column } from 'material-table';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';
import LoadingBar from 'react-top-loading-bar';

import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import useAlert from 'hooks/useAlert';
import useAsync from 'hooks/useAsync';
import useModal from 'hooks/useModal';
import usePermission from 'hooks/usePermission';

import useLocalization from 'hooks/useLocalization';
import userAPI from 'app/api/userAPI';
import { User } from 'app/types/user';
import { materialTableOptions } from 'app/configs/material-table';

interface RowData extends User {}

interface Props {
  history: RouteComponentProps['history'];
}

const ManageUsersContainer: React.FC<Props> = ({ history }) => {
  const { materialTable } = useLocalization();
  const { t }: { t: any } = useTranslation();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const confirm = useConfirm();
  const { alertSuccess, alertError } = useAlert();
  const { closeModal } = useModal();
  const { ref, startLoading, endLoading } = useAsync();

  const { canCreateUser, canUpdateUser, canDeleteUser } = usePermission();

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;

  const handleDelete = (ids: string[]) => {
    confirm({ description: t('WARNING_DELETE_USER') })
      .then(() => {
        setLoading(true);
        return userAPI.deleteUsers(ids);
      })
      .then(users => {
        console.log(users);
        alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
        closeModal();
        history.push('/users');

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        alertError(t('MESSAGE_ALERT_ERROR'));
        setLoading(false);
      });
  };

  const columns: Column<RowData>[] = [
    {
      title: t('FIELDS_USERNAME'),
      field: 'username',
      render: (rowData: any) => (
        <Typography
          variant='body2'
          component={Link}
          to={`/users/info/${rowData.id}`}
          color='secondary'
          style={{ textDecoration: 'none' }}
        >
          {rowData.username}
        </Typography>
      ),
    },
    { title: t('FIELDS_EMAIL'), field: 'email' },
    { title: t('FIELDS_PHONE_NUMBER'), field: 'phoneNumber' },
    {
      title: t('MODEL_ROLE'),
      field: 'role',
      render: (rowData: any) => (
        <Typography variant='body2'>{rowData.role.name}</Typography>
      ),
    },
  ];

  const actions: Action<RowData>[] = [
    {
      icon: 'delete',
      tooltip: t('ACTIONS_DELETE'),
      hidden: !canDeleteUser,
      iconProps: {
        style: { color: secondaryColor },
      },
      onClick: (event, rowData) => {
        const ids = (rowData as RowData[]).map((data: any) => data.id);
        handleDelete(ids);
      },
    },
    {
      icon: 'edit',
      tooltip: t('ACTIONS_EDIT'),
      hidden: !canUpdateUser,
      iconProps: {
        style: { color: primaryColor },
      },
      position: 'row',
      onClick: (e: any, rowData: any) => history.push(`/users/${rowData.id}`),
    },
    {
      icon: 'add',
      tooltip: t('ACTIONS_ADD'),
      isFreeAction: true,
      hidden: !canCreateUser,
      disabled: false,
      onClick: () => history.push('/users/create'),
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
            userAPI
              .getUsers({
                search: query.search,
                page: query.page,
                limit: query.pageSize,
              })
              .then(res => {
                resolve({
                  data: res.docs,
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
        options={{ ...materialTableOptions, selection: canDeleteUser }}
        localization={materialTable}
        isLoading={loading}
      />
    </Fragment>
  );
};

export default ManageUsersContainer;
