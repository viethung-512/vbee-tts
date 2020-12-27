import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';

import useRenderFields from 'hooks/useRenderFields';
import StatusTag from './StatusTag';
import { SentenceStatus } from '@tts-dev/common';

interface Props {
  columnDef: any;
  onFilterChanged: (rowId: string, value: any) => void;
}

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiSelect-select.MuiSelect-select': {
      paddingRight: 0,
    },
  },
}));

const StatusFilter: React.FC<Props> = ({ onFilterChanged, columnDef }) => {
  const classes = useStyles();
  const [status, setStatus] = useState<SentenceStatus[]>([]);
  const { getStatus } = useRenderFields();

  return (
    <Select
      multiple
      value={status}
      onChange={event => {
        setStatus(event.target.value as SentenceStatus[]);
        onFilterChanged(columnDef.tableData.id, event);
      }}
      renderValue={selected => (
        <Grid container spacing={1}>
          {(selected as SentenceStatus[]).map(value => (
            <Grid item key={value}>
              <StatusTag statusCode={value} />
            </Grid>
          ))}
        </Grid>
      )}
      style={{ width: '100%' }}
      className={classes.root}
      IconComponent={() => <span style={{ display: 'none' }}>Icon</span>}
    >
      {Object.values(SentenceStatus).map(status => (
        <MenuItem key={status} value={status}>
          {getStatus(status).name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default StatusFilter;
