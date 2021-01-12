import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SentenceType, DialectType } from '@tts-dev/common';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import useAlert from 'hooks/useAlert';
import broadcasterAPI from 'app/api/broadcasterAPI';
import { sentenceTypes, dialects } from 'app/utils/constants';
import { setCurrentDialect } from 'features/broadcaster/broadcasterSlice';

import Input from 'app/layout/commons/form/Input';
import Spinner from 'app/layout/commons/async/Spinner';

interface Props {
  history: RouteComponentProps['history'];
}

interface BroadcasterRecordField {
  type: SentenceType;
  dialect: DialectType;
}

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
  },
  formItem: {
    marginBottom: theme.spacing(2),
  },
  container: {
    maxWidth: '20em',
    backgroundColor: '#fff',
    boxShadow: theme.shadows[2],
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
}));

const defaultValues: BroadcasterRecordField = {
  type: SentenceType.BOOK,
  dialect: DialectType.HANOI,
};

const BroadcasterRecordContainer: React.FC<Props> = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t }: { t: any } = useTranslation();
  const { alertError, alertInfo } = useAlert();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<BroadcasterRecordField>({
    mode: 'onChange',
    defaultValues,
  });

  const submitForm = handleSubmit(values => {
    setLoading(true);
    broadcasterAPI
      .getBroadcasterSentenceInit(values.type, values.dialect)
      .then(({ data }) => {
        if (data) {
          dispatch(setCurrentDialect(values.dialect));
          history.push(`/broadcaster-record/${data}`);
        } else {
          alertInfo(t('MESSAGE_ALERT_INFO__NO_AVAILABLE_BROADCASTER_SENTENCE'));
        }
      })
      .catch(err => {
        console.log(err);
        alertError(t('MESSAGE_ALERT_ERROR'));
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return (
    <form className={classes.form} onSubmit={submitForm}>
      <Grid container direction='column' className={classes.container}>
        <Grid item container className={classes.formItem}>
          <Input
            size='small'
            label={t('FIELDS_SENTENCE_TYPE')}
            select
            name='type'
            control={control}
            isError={false}
            errorMessage=''
          >
            {Object.values(sentenceTypes).map(type => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Input>
        </Grid>
        <Grid item container className={classes.formItem}>
          <Input
            size='small'
            label={t('FIELDS_BROADCASTER_DIALECT')}
            select
            name='dialect'
            control={control}
            isError={false}
            errorMessage=''
          >
            {Object.values(dialects).map(dialect => (
              <MenuItem key={dialect} value={dialect}>
                {dialect}
              </MenuItem>
            ))}
          </Input>
        </Grid>
        <Grid
          item
          container
          className={classes.formItem}
          style={{ marginBottom: 0 }}
        >
          <Button
            variant='contained'
            color='primary'
            fullWidth
            type='submit'
            disabled={loading}
          >
            {loading ? <Spinner /> : t('ACTIONS_CONFIRM')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default BroadcasterRecordContainer;
