import React, { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import MaterialTable, { Action, Column } from 'material-table';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';

import { useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import useAlert from 'hooks/useAlert';
import useDrawer from 'hooks/useDrawer';
import useModal from 'hooks/useModal';
import usePermission from 'hooks/usePermission';
import useLocalization from 'hooks/useLocalization';

import sentenceAPI from 'app/api/sentenceAPI';
import DefaultAvatar from 'app/layout/commons/DefaultAvatar';
import StatusTag from 'app/layout/commons/sentence-record/StatusTag';
import StatusFilter from 'app/layout/commons/sentence-record/StatusFilter';
import TypeFilter from 'app/layout/commons/sentence-record/TypeFilter';
import { Sentence } from 'app/types/sentence';
import { formatUID } from 'app/utils/helper';
import { materialTableOptions } from 'app/configs/material-table';

interface RowData extends Sentence {}

interface Props {
  history: RouteComponentProps['history'];
}

const ManageSentencesContainer: React.FC<Props> = ({ history }) => {
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

  const handleApprove = async (ids: string[]) => {
    confirm({ description: t('WARNING_APPROVE_SENTENCE') })
      .then(() => {
        setLoading(true);
        return sentenceAPI.approveSentences(ids);
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

  const handleDelete = async (ids: string[]) => {
    confirm({ description: t('WARNING_DELETE_SENTENCE') })
      .then(() => {
        setLoading(true);
        return sentenceAPI.deleteSentences(ids);
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

  const checkerMarkup = (rowData: RowData) => {
    if (rowData.checker) {
      const { username, photoURL, id } = rowData.checker;

      return (
        <Tooltip title={username}>
          <Avatar
            alt={username}
            src={photoURL}
            component={Link}
            to={`/users/info/${id}`}
          >
            <DefaultAvatar />
          </Avatar>
        </Tooltip>
      );
    }

    return <Typography variant='body2'>Chưa có</Typography>;
  };

  const uidMarkup = (rowData: RowData) => (
    <Typography
      variant='body2'
      component={Link}
      to={`/sentences/${rowData.id}`}
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
            openModal('AssignSentenceModal', { isAutoAssign: true });
          },
          isFreeAction: true,
          hidden: !isRootUser,
        },
        {
          tooltip: t('ACTIONS_CHECKING_PROGRESS'),
          icon: () => <PlaylistAddCheckIcon color='secondary' />,
          onClick: (evt, data) => {
            openDrawer('CheckingProgressDrawer', {
              subject: 'sentence',
            });
          },
          isFreeAction: true,
        },
        {
          tooltip: t('ACTIONS_ASSIGN'),
          icon: () => <AssignmentReturnIcon color='primary' />,
          onClick: (evt, data) => {
            const ids = (data as RowData[]).map(item => item.id);

            openModal('AssignSentenceModal', {
              sentenceIds: ids,
              isAutoAssign: false,
            });
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
            // openDrawer('CheckingSentenceProgressDrawer');
            openDrawer('CheckingProgressDrawer', {
              model: 'sentence',
              field: 'progressCheckingSentence',
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
      title: t('FIELDS_CHECKER'),
      field: 'checker',
      width: 100,
      render: checkerMarkup,
      hidden: !isRootUser,
      filtering: false,
    },
    {
      title: t('FIELDS_SENTENCE_TYPE'),
      field: 'type',
      width: 50,
      filterComponent: props => <TypeFilter {...props} />,
    },
    {
      title: t('FIELDS_SENTENCE_ORIGINAL'),
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
          sentenceAPI
            .getSentences(
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

export default ManageSentencesContainer;
