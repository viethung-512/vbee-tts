import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import { recordTypes } from 'app/utils/constants';
import { SentenceType } from '@tts-dev/common';

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

const TypeFilter: React.FC<Props> = ({ columnDef, onFilterChanged }) => {
  const classes = useStyles();
  const [types, setTypes] = useState<SentenceType[]>([]);

  return (
    <Select
      multiple
      value={types}
      onChange={event => {
        setTypes(event.target.value as SentenceType[]);
        onFilterChanged(columnDef.tableData.id, event);
      }}
      renderValue={selected => (
        <Grid container spacing={1}>
          {(selected as SentenceType[]).map(value => (
            <Grid item key={value}>
              <Chip size='small' label={value} />
            </Grid>
          ))}
        </Grid>
      )}
      style={{ width: '100%' }}
      className={classes.root}
      IconComponent={() => <span style={{ display: 'none' }}>Icon</span>}
    >
      {Object.values(recordTypes).map(type => (
        <MenuItem key={type} value={type}>
          {type}
        </MenuItem>
      ))}
    </Select>
  );
};

export default TypeFilter;
