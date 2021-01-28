import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Button from 'app/layout/commons/form/Button';

import {
  listParadigms,
  listVoices,
  listCorpora,
} from 'app/constants/training-constants';

interface Props {
  handleTraining: (paradigm: string, voice: string, corpora: string[]) => void;
  loading: boolean;
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: theme.spacing(2),
    boxShadow: theme.shadows[3],
  },
  form: {
    width: '100%',
  },
  formItem: {
    marginBottom: theme.spacing(2),
  },
}));

const paradigms = listParadigms.map(paradigm => ({
  label: paradigm.name,
  value: paradigm.key,
}));
const voices = listVoices.map(voice => ({
  label: voice.name,
  value: voice.key,
}));
const corpus = listCorpora.map(paradigm => ({
  label: paradigm.name,
  value: paradigm.key,
}));

const defaultValues = {
  voice: '',
  corpora: [''],
};

const TrainingActionsForm: React.FC<Props> = ({ handleTraining, loading }) => {
  const classes = useStyles();
  const { control, handleSubmit } = useForm<{
    voice: string;
    corpora: string[];
  }>({
    mode: 'onChange',
    defaultValues: defaultValues,
  });
  const { t } = useTranslation();
  const theme = useTheme();
  const [paradigm, setParadigm] = useState<string>('');

  const submitForm = handleSubmit(values => {
    const valueVoice = (values.voice as any).value;
    const valueCorpora = values.corpora.map((corpus: any) => corpus.value);

    handleTraining(paradigm, valueVoice, valueCorpora);
  });

  const handleParadigmChange = (e: any) => {
    setParadigm(e.value);
  };

  return (
    <Grid container className={classes.root}>
      <Typography
        variant='h6'
        gutterBottom
        style={{ marginBottom: theme.spacing(4) }}
      >
        Vui lòng điền đầy đủ thông tin
      </Typography>
      <form onSubmit={submitForm} className={classes.form}>
        <Typography variant='body2' color='textSecondary'>
          Cách thức huấn luyện*
        </Typography>
        <Select
          options={paradigms}
          className={classes.formItem}
          onChange={handleParadigmChange}
        />
        {paradigm === listParadigms[0].key && (
          <Fragment>
            <Typography variant='body2' color='textSecondary'>
              Giọng huấn luyện*
            </Typography>

            <Controller
              name='voice'
              control={control}
              options={voices}
              as={Select}
              className={classes.formItem}
            />
            <Typography variant='body2' color='textSecondary'>
              Loại câu*
            </Typography>

            <Controller
              name='corpora'
              control={control}
              options={corpus}
              as={Select}
              className={classes.formItem}
              isMulti
            />
            <Button
              content={t('ACTIONS_TRAINING')}
              variant='primary'
              type='submit'
              style={{ width: 150 }}
              loading={loading}
            />
          </Fragment>
        )}
      </form>
    </Grid>
  );
};

export default TrainingActionsForm;
