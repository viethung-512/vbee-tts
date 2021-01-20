import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import { voices as defaultVoices } from 'app/utils/constants';

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

const VoiceFilter: React.FC<Props> = ({ columnDef, onFilterChanged }) => {
  const classes = useStyles();
  const [voices, setVoices] = useState<string[]>([]);

  return (
    <Select
      multiple
      value={voices}
      onChange={event => {
        setVoices(event.target.value as string[]);
        onFilterChanged(columnDef.tableData.id, event);
      }}
      renderValue={selected => (
        <Grid container spacing={1}>
          {(selected as string[]).map(value => (
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
      {defaultVoices.map(voice => (
        <MenuItem key={voice} value={voice}>
          {voice}
        </MenuItem>
      ))}
    </Select>
  );
};

export default VoiceFilter;
