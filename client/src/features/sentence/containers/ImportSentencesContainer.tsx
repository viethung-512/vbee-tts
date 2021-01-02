import React, { useState, useRef, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
// @ts-ignore
import readXlsxFile from 'read-excel-file';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import AttachFileIcon from '@material-ui/icons/AttachFile';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';

import useAlert from 'hooks/useAlert';
import usePromiseSubscription from 'hooks/usePromiseSubscription';
import PreviewData from '../components/PreviewData';
import Button from 'app/layout/commons/form/Button';
import sentenceAPI from 'app/api/sentenceAPI';
import { FieldError } from '@tts-dev/common';

interface Props {
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  container: {
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
  },
  errorTag: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
  helperText: {
    marginBottom: theme.spacing(2),
    fontSize: '0.75rem',
  },
}));

const getColumns = (previewData: any[]) => {
  const firstRow = previewData[0];

  const columns = (firstRow as any[]).map((item, index) => ({
    title: item,
    field: item.toLowerCase(),
    index: index,
    width: item.toLowerCase() === 'type' ? 100 : 'auto',
  }));

  return columns;
};

const getData = (previewData: any[]) => {
  const columns = getColumns(previewData);

  const data = previewData
    .filter((it, index) => index !== 0)
    .map(row => {
      const result: Record<string, any> = {};
      (row as any[]).forEach((elm, index) => {
        const field = columns.find(cl => cl.index === index)!.field;
        result[field] = elm;
      });

      return result;
    });

  return data;
};

const ImportSentencesContainer: React.FC<Props> = ({ history }) => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const [files, setFiles] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>([]);
  const confirm = useConfirm();

  const { alertSuccess, alertError } = useAlert();
  const {
    value: sampleFileURL,
    isPending: fetching,
  } = usePromiseSubscription<string>(sentenceAPI.getSampleImportFileURL, '');

  const handleImport = async (file: any) => {
    confirm({ description: t('WARNING_IMPORT_SENTENCE') })
      .then(() => {
        setLoading(true);
        sentenceAPI
          .importSentences(file)
          .then(sentences => {
            console.log(sentences);
            alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
            history.push('/sentences');

            setLoading(false);
          })
          .catch((err: FieldError[]) => {
            err.forEach(er => {
              alertError(er.message);
            });
            setLoading(false);
          });
      })
      .catch(() => {
        // console.log('test');
        // console.log(err);
        // alertError(t('MESSAGE_ALERT_ERROR'));
        // setLoading(false);
      });
  };

  const uploadFileRef = useRef<HTMLInputElement>(null);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    if (e.target && e.target.files) {
      const filename = e.target.files[0].name;

      const fileExtension = filename.split('.')[filename.split('.').length - 1];

      if (fileExtension === 'xlsx') {
        setFiles(e.target.files);
      } else {
        setError(filename);
        setFiles([]);
      }
    }
  };

  const handlePreviewData = () => {
    setLoading(true);

    readXlsxFile(files[0])
      .then((rows: any[]) => {
        setPreviewData(rows);
        setTimeout(() => {
          setLoading(false);
        }, 250);
      })
      .catch((err: any) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setFiles([]);
    setError(null);
    setPreviewData([]);
    if (uploadFileRef && uploadFileRef.current) {
      uploadFileRef.current!.value = '';
    }
  };

  const columns = previewData.length > 0 ? getColumns(previewData) : [];
  const rowData = previewData.length > 0 ? getData(previewData) : [];

  console.log({ sampleFileURL });

  return (
    <Fragment>
      {fetching && <LinearProgress color='secondary' />}
      <Grid container direction='column' className={classes.container}>
        <Grid item>
          <Typography variant='body1'>{t('ACTIONS_SELECT_FILE')}</Typography>
          <Typography
            variant='body2'
            className={classes.helperText}
            color='textSecondary'
          >
            {t('WARNING_FILE_TYPE_REQUIRE')}{' '}
            <span>
              <a href={sampleFileURL}>Sample file</a>
            </span>
          </Typography>
        </Grid>

        <Grid item container justify='space-between' alignItems='center'>
          <Grid item>
            <Grid container alignItems='center'>
              <Grid item>
                <input
                  ref={uploadFileRef}
                  style={{ display: 'none' }}
                  id='import-sentences'
                  type='file'
                  onChange={handleChangeFile}
                />
                <label htmlFor='import-sentences'>
                  <Button
                    content='Upload'
                    variant='primary'
                    aria-label='upload picture'
                    // @ts-ignore
                    component='span'
                    startIcon={<AttachFileIcon />}
                  />
                </label>
              </Grid>
              <Grid item>
                {files.length > 0 && (
                  <Chip
                    label={files[0].name}
                    onDelete={handleCancel}
                    color='primary'
                    variant='outlined'
                    size='small'
                    style={{ marginLeft: theme.spacing(2) }}
                  />
                )}
                {error && (
                  <Chip
                    label={`${error} is not accept`}
                    color='secondary'
                    variant='outlined'
                    size='small'
                    className={classes.errorTag}
                    style={{ marginLeft: theme.spacing(2) }}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            {previewData.length > 0 && (
              <Button
                content={t('TITLE_IMPORT_SENTENCE')}
                variant='secondary'
                onClick={() => {
                  handleImport(files[0]);
                }}
                style={{ marginRight: theme.spacing(2) }}
              />
            )}
            <Button
              content={t('ACTIONS_PREVIEW')}
              variant='success'
              onClick={handlePreviewData}
              disabled={files.length <= 0}
            />
          </Grid>
        </Grid>

        <Grid item container>
          {previewData.length > 0 && (
            <PreviewData
              loading={loading}
              rowData={rowData}
              columns={columns}
            />
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ImportSentencesContainer;
