import React, { useState, Fragment } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import MaterialTable, { Action, Column } from 'material-table';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';
import LoadingBar from 'react-top-loading-bar';

import { useTheme, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useAlert from 'hooks/useAlert';
import useAsync from 'hooks/useAsync';
import usePermission from 'hooks/usePermission';

import { materialTableOptions } from 'app/configs/material-table';

import useLocalization from 'hooks/useLocalization';
import broadcasterAPI from 'app/api/broadcasterAPI';
import { Broadcaster } from 'app/types/broadcaster';
import LinearProgressWithLabel from 'app/layout/commons/async/LinearProgressWithLabel';

interface RowData extends Broadcaster {}

interface Props {
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  tag: {
    width: '100%',
  },
}));

const ManageBroadcasterContainer: React.FC<Props> = ({ history }) => {
  const { materialTable } = useLocalization();
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const confirm = useConfirm();
  const [loading, setLoading] = useState(false);
  const { alertSuccess, alertError } = useAlert();
  const { ref, startLoading, endLoading } = useAsync();
  const classes = useStyles();
  const { isRootUser } = usePermission();

  const handleDelete = (ids: string[]) => {
    confirm({ description: t('WARNING_DELETE_BROADCASTER') })
      .then(() => {
        setLoading(true);
        return broadcasterAPI
          .deleteBroadcasters(ids)
          .then(() => {
            setLoading(false);
            alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
            history.push('/broadcasters');
          })
          .catch(err => {
            setLoading(false);
            console.log(err);
            alertError(t('MESSAGE_ALERT_ERROR'));
          });
      })
      .catch(err => console.log(err));
  };

  const columns: Column<RowData>[] = [
    {
      title: t('FIELDS_USERNAME'),
      field: 'user',
      render: rowData => {
        console.log(rowData);
        return (
          <Typography
            variant='body2'
            component={Link}
            to={`/users/info/${rowData.user.id}`}
            color='secondary'
            style={{ textDecoration: 'none' }}
          >
            {rowData.user.username}
          </Typography>
        );
      },
      width: 300,
    },
    {
      title: t('FIELDS_SENTENCE_TYPE'),
      field: 'sentenceTypes',
      render: rowData => {
        return rowData.progresses.map(({ type, percent }) => {
          // const {
          //   progress: { percent },
          // } = rowData.progresses.find(p => p.type === type);

          return (
            <Grid key={type} container alignItems='center' spacing={1}>
              <Grid item style={{ width: 120 }}>
                <Chip
                  size='small'
                  label={type}
                  variant='outlined'
                  className={classes.tag}
                />
              </Grid>

              <Grid item xs={8}>
                <LinearProgressWithLabel value={percent} />
              </Grid>
            </Grid>
          );
        });
      },
    },
  ];

  const actions: Action<RowData>[] = [
    {
      icon: 'add',
      tooltip: t('ACTIONS_ADD'),
      isFreeAction: true,
      onClick: event => {
        history.push('/broadcasters/create');
      },
    },
    {
      icon: 'delete',
      iconProps: {
        style: {
          color: theme.palette.secondary.main,
        },
      },
      tooltip: t('ACTIONS_DELETE'),
      onClick: (event, rowData) => {
        const ids = (rowData as RowData[]).map((data: any) => data.id);
        handleDelete(ids);
      },
    },
    {
      icon: 'edit',
      iconProps: {
        style: { color: theme.palette.primary.main },
      },
      position: 'row',
      tooltip: t('ACTIONS_EDIT'),
      onClick: (event, rowData) => {
        history.push(`/broadcasters/${(rowData as RowData).id}`);
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
            broadcasterAPI
              .getBroadcasters({
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
        options={{ ...materialTableOptions, selection: isRootUser }}
        localization={materialTable}
        isLoading={loading}
      />
    </Fragment>
  );
};

export default ManageBroadcasterContainer;
