import { Voice } from 'app/types/voice';
import React, { Fragment } from 'react';
import { Action, Column } from 'material-table';
import { useTranslation } from 'react-i18next';

import { materialTableOptions } from 'app/configs/material-table';
import ManageVoicesContainer from 'features/voice/containers/ManageVoicesContainer';

export interface RowData extends Voice {}

const ManageVoices: React.FC = () => {
  const { t }: { t: any } = useTranslation();

  const actions: Action<RowData>[] = [
    // {
    //   icon: 'add',
    //   tooltip: t('ACTIONS_ADD'),
    //   isFreeAction: true,
    //   onClick: event => {
    //     openModal('CreateVoiceModal');
    //   },
    // },
    // {
    //   icon: 'delete',
    //   iconProps: {
    //     style: { color: theme.palette.secondary.main },
    //   },
    //   tooltip: t('ACTIONS_DELETE'),
    //   onClick: (event, rowData) => {
    //   },
    // },
  ];

  const columns: Column<RowData>[] = [
    {
      title: t('FIELDS_VOICE_CODE'),
      field: 'code',
    },
    {
      title: t('FIELDS_VOICE_NAME'),
      field: 'name',
    },
  ];

  return (
    <Fragment>
      <ManageVoicesContainer
        columns={columns}
        actions={actions}
        options={{ ...materialTableOptions, selection: false }}
      />
    </Fragment>
  );
};

export default ManageVoices;
