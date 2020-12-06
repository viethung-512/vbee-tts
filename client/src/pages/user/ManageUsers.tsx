import React, { Fragment } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Action, Column } from 'material-table';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import useModal from 'hooks/useModal';
import usePermission from 'hooks/usePermission';
import ManageUsersContainer from 'features/user/container/ManageUsersContainer';
import Confirms from 'features/user/Confirms';
import { materialTableOptions } from 'app/configs/material-table';
import { modalActionTypes } from 'app/utils/constants';
import { User } from 'app/types/user';

interface Props {
  history: RouteComponentProps['history'];
}

export interface RowData extends User {}

const ManageUsers: React.FC<Props> = ({ history }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { openModal } = useModal();

  const { canCreateUser, canUpdateUser, canDeleteUser } = usePermission();

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;

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
        openModal('ConfirmModal', {
          data: { ids: (rowData as RowData[]).map((data: any) => data.id) },
          type: modalActionTypes.DELETE_USER,
        });
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
      <ManageUsersContainer
        columns={columns}
        actions={actions}
        options={{ ...materialTableOptions, selection: canDeleteUser }}
      />
      <Confirms history={history} />
    </Fragment>
  );
};

export default ManageUsers;
