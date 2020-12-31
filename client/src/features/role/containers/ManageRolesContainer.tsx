import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import MaterialTable, {
  Action as MTAction,
  Column as MTColumn,
} from 'material-table';
import { useConfirm } from 'material-ui-confirm';
import { Resource, Action } from '@tts-dev/common';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useAlert from 'hooks/useAlert';
import useModal from 'hooks/useModal';
import usePermission from 'hooks/usePermission';
import useLocalization from 'hooks/useLocalization';

import roleAPI from 'app/api/roleAPI';
import { Role } from 'app/types/role';
import { materialTableOptions } from 'app/configs/material-table';
import { formatResources } from 'app/utils/helper';

interface RowData extends Role {}
interface Props {
  history: RouteComponentProps['history'];
}

const ManageRolesContainer: React.FC<Props> = ({ history }) => {
  const { t }: { t: any } = useTranslation();
  const confirm = useConfirm();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { materialTable } = useLocalization();
  const { alertSuccess, alertError } = useAlert();
  const { closeModal } = useModal();
  const { canCreateRole, canUpdateRole, canDeleteRole } = usePermission();

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;

  const handleDelete = (ids: string[]) => {
    confirm({ description: t('WARNING_DELETE_ROLE') })
      .then(() => {
        setLoading(true);
        return roleAPI.deleteRoles(ids);
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

  const resourcesMarkup = (
    resources: {
      name: Resource;
      actions: Action[];
    }[]
  ) => {
    const formattedResource = formatResources(
      resources.filter(rs => rs.actions.length > 0)
    );

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
        const ids = (rowData as RowData[]).map((data: any) => data.id);
        handleDelete(ids);
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
    <MaterialTable
      columns={columns}
      data={query => {
        return new Promise((resolve, reject) => {
          roleAPI
            .getRoles({
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
            });
        });
      }}
      actions={actions}
      options={{ ...materialTableOptions, selection: canDeleteRole }}
      localization={materialTable}
      isLoading={loading}
    />
  );
};

export default ManageRolesContainer;
