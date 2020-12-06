import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Action as MTAction, Column as MTColumn } from 'material-table';
import { useTranslation } from 'react-i18next';
import { Resource, Action } from '@tts-dev/common';

import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useModal from 'hooks/useModal';
import usePermission from 'hooks/usePermission';
import { materialTableOptions } from 'app/configs/material-table';
import { modalActionTypes } from 'app/utils/constants';

import ManageRolesContainer from 'features/role/containers/ManageRolesContainer';
import Confirms from 'features/role/Confirms';
import { formatResources } from 'app/utils/helper';
import { Role } from 'app/types/role';

interface Props {
  history: RouteComponentProps['history'];
}

export interface RowData extends Role {}

const ManageRoles: React.FC<Props> = ({ history }) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const theme = useTheme();
  const { canCreateRole, canUpdateRole, canDeleteRole } = usePermission();

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;

  const resourcesMarkup = (
    resources: {
      name: Resource;
      actions: Action[];
    }[]
  ) => {
    const formattedResource = formatResources(resources);

    return formattedResource.map(rs => {
      return (
        <Grid container key={rs.name} spacing={1}>
          <Grid item xs={2}>
            <Typography variant='body2'>{rs.name}</Typography>
          </Grid>
          <Grid item container xs={10} spacing={1}>
            {rs.actions.map(act => {
              return (
                <Grid item key={`${rs.name}_${act}`}>
                  <Chip variant='outlined' size='small' label={act} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      );
    });
  };

  const roleNameMarkup = (role: Role) => {
    return (
      <Grid container>
        <Grid item container>
          <Typography
            variant='body2'
            component={Link}
            to={`/roles/${role.id}`}
            color='secondary'
            style={{ textDecoration: 'none' }}
          >
            {role.name}
          </Typography>
        </Grid>

        <Grid item container>
          {role && role.policy.draft_version && (
            <Chip
              variant='outlined'
              size='small'
              color='primary'
              label={t('TITLE_ROLE_NEED_APPROVE')}
            />
          )}
        </Grid>
      </Grid>
    );
  };

  const columns: MTColumn<RowData>[] = [
    {
      title: t('MODEL_ROLE'),
      field: 'name',
      width: 200,
      render: rowData => {
        return roleNameMarkup(rowData);
      },
    },
    {
      title: t('RESOURCE'),
      field: 'resources',
      render: rowData => resourcesMarkup(rowData.resources),
    },
  ];

  const actions: MTAction<RowData>[] = [
    {
      icon: 'edit',
      tooltip: t('ACTIONS_EDIT'),
      hidden: !canUpdateRole,
      onClick: (_, rowData) =>
        history.push(`/roles/${(rowData as RowData).id}`),
      iconProps: {
        style: { color: primaryColor },
      },
      position: 'row',
    },
    {
      icon: 'delete',
      tooltip: t('ACTIONS_DELETE'),
      hidden: !canDeleteRole,
      onClick: (_, rowData) => {
        openModal('ConfirmModal', {
          data: { ids: (rowData as RowData[]).map(data => data.id) },
          type: modalActionTypes.DELETE_ROLE,
        });
      },
      iconProps: {
        style: { color: secondaryColor },
      },
    },
    {
      icon: 'add',
      tooltip: t('ACTIONS_ADD'),
      isFreeAction: true,
      hidden: !canCreateRole,
      onClick: () => history.push('/roles/create'),
    },
  ];

  return (
    <div>
      <ManageRolesContainer
        columns={columns}
        actions={actions}
        options={{ ...materialTableOptions, selection: canDeleteRole }}
      />
      <Confirms />
    </div>
  );
};

export default ManageRoles;
