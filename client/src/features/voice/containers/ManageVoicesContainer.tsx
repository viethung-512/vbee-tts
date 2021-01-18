import React, { Fragment } from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';
import LoadingBar from 'react-top-loading-bar';

import { useTheme } from '@material-ui/core/styles';

import useAsync from 'hooks/useAsync';
import useLocalization from 'hooks/useLocalization';
import voiceAPI from 'app/api/voiceAPI';

import { RowData } from 'pages/voice/ManageVoices';

interface Props {
  columns: Column<RowData>[];
  actions: Action<RowData>[];
  options: Options<RowData>;
}

const ManageVoicesContainer: React.FC<Props> = ({
  columns,
  actions,
  options,
}) => {
  const { materialTable } = useLocalization();
  const theme = useTheme();
  const { ref, startLoading, endLoading } = useAsync();

  return (
    <Fragment>
      <LoadingBar color={theme.palette.secondary.main} ref={ref} />
      <MaterialTable
        columns={columns}
        data={query => {
          return new Promise((resolve, reject) => {
            startLoading();
            voiceAPI
              .getVoices({
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
        options={options}
        localization={materialTable}
      />
    </Fragment>
  );
};

export default ManageVoicesContainer;
