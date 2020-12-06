import React from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';

import useLocalization from 'hooks/useLocalization';
import roleAPI from 'app/api/roleAPI';
import { RowData } from 'pages/role/ManageRoles';

interface Props {
  columns: Column<RowData>[];
  actions: Action<RowData>[];
  options: Options<RowData>;
}

const ManageRolesContainer: React.FC<Props> = ({
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
      options={options}
      localization={materialTable}
      // components={{
      //   Row: props => {
      //     const propsCopy = { ...props };
      //     propsCopy.actions.find(a => a.name === 'delete').disabled =
      //       propsCopy.data.id < 100;
      //     propsCopy.actions.find(a => a.name === 'edit').disabled =
      //       propsCopy.data.name !== 'Paper';
      //     return <MTableBodyRow {...propsCopy} />;
      //   },
      // }}
    />
  );
};

export default ManageRolesContainer;
