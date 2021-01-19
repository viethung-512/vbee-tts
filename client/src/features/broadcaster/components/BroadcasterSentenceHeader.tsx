import React, { Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Controller, Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Input from 'app/layout/commons/form/Input';
import { formatUID } from 'app/utils/helper';
import { Sentence } from 'app/types/sentence';
import { DialectType, SentenceType } from '@tts-dev/common';
import { BroadcasterSentenceFields } from '../containers/BroadcasterSentenceContainer';

interface Props {
  control: Control;
  sentences: Sentence[];
  searching: boolean;
  setSentences: React.Dispatch<React.SetStateAction<Sentence[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    boxShadow: theme.shadows[3],
  },
  item: {
    marginBottom: theme.spacing(2),
  },
  inputRoot: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  },
}));

const BroadcasterSentenceHeader: React.FC<Props> = ({
  control,
  sentences,
  searching,
  history,
  setSearchTerm,
  setSentences,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const { t }: { t: any } = useTranslation();

  return (
    <Grid container direction='column' className={classes.container}>
      <Grid item className={classes.item}>
        <Controller
          render={({ onChange, ...props }) => (
            <Autocomplete
              size='small'
              options={sentences}
              disableClearable
              getOptionLabel={option => {
                if (option && option.original) {
                  return option.original;
                }

                return '';
              }}
              loading={searching}
              getOptionSelected={(option, value) => option.iso === value.iso}
              renderOption={option => {
                return (
                  <Fragment>
                    <Grid container alignItems='center' justify='space-between'>
                      <Grid item style={{ marginRight: theme.spacing(2) }}>
                        <Chip
                          label={formatUID(option.uid)}
                          variant='outlined'
                          size='small'
                        />
                      </Grid>
                      <Grid item style={{ width: 'calc(100% - 7rem)' }}>
                        <Typography variant='body2' color='secondary' noWrap>
                          {option.original}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Fragment>
                );
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t('MODEL_SENTENCE')}
                  variant='outlined'
                  className={classes.inputRoot}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
              onChange={(e, data) => {
                history.push(`/broadcaster-record/${data.id}`);
              }}
              onInputChange={(e, value) => setSearchTerm(value)}
              {...props}
            />
          )}
          name='search'
          control={control}
        />
      </Grid>

      <Grid item className={classes.item}>
        <Input
          size='small'
          label={t('FIELDS_SENTENCE_TYPE')}
          select
          name='type'
          control={control}
          isError={false}
          errorMessage=''
        >
          {Object.values(SentenceType).map(type => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Input>
      </Grid>
      <Grid item>
        <Input
          size='small'
          label={t('FIELDS_DIALECT')}
          select
          name='dialect'
          control={control}
          isError={false}
          errorMessage=''
        >
          {Object.values(DialectType).map(type => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Input>
      </Grid>
    </Grid>
  );
};

export default BroadcasterSentenceHeader;
