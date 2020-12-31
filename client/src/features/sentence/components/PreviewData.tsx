import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MaterialTable, { Column } from 'material-table';
import LinearProgress from '@material-ui/core/LinearProgress';

interface Props {
  loading: boolean;
  rowData: any[];
  columns: Column<any>[];
}

const PreviewData: React.FC<Props> = ({ rowData, columns, loading }) => {
  const theme = useTheme();

  return (
    <Grid container direction='column' style={{ marginTop: theme.spacing(2) }}>
      <Grid item>{loading && <LinearProgress />}</Grid>
      <Grid item container>
        <MaterialTable
          style={{ width: '100%' }}
          columns={columns}
          data={rowData}
          options={{
            search: false,
            toolbar: false,
            showTitle: false,
            rowStyle: {
              fontSize: '0.875rem',
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PreviewData;
