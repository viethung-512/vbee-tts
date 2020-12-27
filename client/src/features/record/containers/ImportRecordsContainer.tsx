import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useConfirm } from 'material-ui-confirm';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useAlert from 'hooks/useAlert';
import useMutation from 'hooks/useMutation';
import Input from 'app/layout/commons/form/Input';
import Button from 'app/layout/commons/form/Button';
import { importAudioValidator } from 'app/utils/validators';
import recordAPI from 'app/api/recordAPI';
import { Record } from 'app/types/record';

interface Props {
  history: RouteComponentProps['history'];
}

interface ImportRecordField {
  shareLink: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  container: {
    boxShadow: theme.shadows[3],
    backgroundColor: '#fff',
    padding: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  formItem: {
    marginBottom: theme.spacing(2),
  },
}));

const ImportRecordsContainer: React.FC<Props> = ({ history }) => {
  const [t] = useTranslation();
  const classes = useStyles();
  const { alertSuccess, alertError } = useAlert();
  const confirm = useConfirm();

  const {
    control,
    errors,
    handleSubmit,
    setError,
  } = useForm<ImportRecordField>({
    mode: 'onChange',
    defaultValues: { shareLink: '' },
    resolver: yupResolver(importAudioValidator),
  });
  const { doRequest: importAudio, loading } = useMutation<
    ImportRecordField,
    Record[]
  >(recordAPI.importRecords, setError, () => {
    alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
    history.push('/records');
  });

  const handleImport = handleSubmit(async values => {
    confirm({ description: t('WARNING_IMPORT_RECORD') })
      .then(() => {
        importAudio(values.shareLink);
      })
      .catch(() => {});
  });

  return (
    <Grid container className={classes.root}>
      {/* {data && data.fileDownloading && data.fileDownloading.percent && (
          <LinearProgressWithLabel value={data?.fileDownloading?.percent} />
        )} */}

      <Grid item container direction='column' className={classes.container}>
        <Grid item className={classes.title}>
          <Typography variant='body1' color='textPrimary'>
            {t('TITLE_IMPORT_RECORD')}
          </Typography>
          <Typography
            variant='body2'
            color='textSecondary'
            style={{ fontSize: 11 }}
          >
            {t('TITLE_IMPORT_RECORD_HELPER_TEXT')}
          </Typography>
        </Grid>
        <form style={{ width: '100%' }}>
          <Grid container direction='column'>
            <Grid item className={classes.formItem}>
              <Input
                size='small'
                name='shareLink'
                label={t('FIELDS_SHARE_LINK')}
                control={control}
                isError={Boolean(errors?.shareLink)}
                errorMessage={errors?.shareLink?.message}
              />
            </Grid>
            <Grid item>
              <Button
                variant='success'
                onClick={handleImport}
                content={t('ACTIONS_CONFIRM')}
                loading={loading}
              />
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default ImportRecordsContainer;
