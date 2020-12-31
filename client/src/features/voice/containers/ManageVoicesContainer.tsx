import React from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';

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

  return (
    <MaterialTable
      columns={columns}
      data={query => {
        return new Promise((resolve, reject) => {
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
            });
        });
      }}
      actions={actions}
      options={options}
      localization={materialTable}
    />
  );
};

export default ManageVoicesContainer;
