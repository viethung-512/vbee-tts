import React, { useState, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SentenceType, DialectType } from '@tts-dev/common';
import { useConfirm } from 'material-ui-confirm';

import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import MUIButton from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';

import MicNoneIcon from '@material-ui/icons/MicNone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import useAlert from 'hooks/useAlert';
import broadcasterAPI from 'app/api/broadcasterAPI';
import Button from 'app/layout/commons/form/Button';
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      style={{ flex: 1 }}
      hidden={value !== index}
      {...other}
    >
      {children}
    </div>
  );
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
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
  root: {
    flexGrow: 1,
    display: 'flex',
    height: 224,
    backgroundColor: '#fff',
    padding: theme.spacing(4, 2),
    boxShadow: theme.shadows[3],
    borderRadius: 4,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
  },
  tabsIndicator: {
    display: 'none',
  },
  errorTag: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}));

const Tab = withStyles(theme => ({
  wrapper: {
    fontWeight: 400,
  },
  selected: {
    backgroundColor: theme.palette.secondary.light,
    borderRadius: 4,
    color: '#fff',
    boxShadow: theme.shadows[3],
  },
}))(MUITab);

const defaultValues: BroadcasterRecordField = {
  type: SentenceType.BOOK,
  dialect: DialectType.HANOI,
};

const BroadcasterRecordContainer: React.FC<Props> = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const { alertError, alertInfo, alertSuccess } = useAlert();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = React.useState(0);
  const confirm = useConfirm();
  const { control, handleSubmit } = useForm<BroadcasterRecordField>({
    mode: 'onChange',
    defaultValues,
  });
  const uploadFileRef = useRef<HTMLInputElement>(null);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    if (e.target && e.target.files) {
      const filename = e.target.files[0].name;

      const fileExtension = filename.split('.')[filename.split('.').length - 1];

      if (fileExtension === 'zip') {
        setFiles(e.target.files);
      } else {
        setError(filename);
        setFiles([]);
      }
    }
  };

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

  const handleUpload = async (file: any) => {
    if (file) {
      confirm({ description: t('WARNING_IMPORT_SENTENCE') })
        .then(() => {
          setLoading(true);
          broadcasterAPI
            .uploadAudio(file)
            .then(({ success }) => {
              console.log({ success });
              if (success) {
                alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
                setFiles([]);
              } else {
                alertError(t('MESSAGE_ALERT_ERROR'));
              }
            })
            .catch(err => {
              console.log(err);
              alertError(t('MESSAGE_ALERT_ERROR'));
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch(() => {});
    }
  };

  const handleCancel = () => {
    setFiles([]);
    setError(null);
    if (uploadFileRef && uploadFileRef.current) {
      uploadFileRef.current!.value = '';
    }
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation='vertical'
        variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Vertical tabs example'
        className={classes.tabs}
        classes={{ indicator: classes.tabsIndicator }}
      >
        <Tab icon={<MicNoneIcon />} label={t('ACTIONS_RECORD')} />
        <Tab icon={<CloudUploadIcon />} label={t('ACTIONS_UPLOAD_AUDIO')} />
      </Tabs>
      <TabPanel value={value} index={0}>
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
              <MUIButton
                variant='contained'
                color='primary'
                fullWidth
                type='submit'
                disabled={loading}
              >
                {loading ? <Spinner /> : t('ACTIONS_CONFIRM')}
              </MUIButton>
            </Grid>
          </Grid>
        </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid
          container
          justify='space-between'
          alignItems='center'
          style={{ padding: theme.spacing(2) }}
        >
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
            {files.length > 0 && (
              <Button
                content={t('ACTIONS_UPLOAD_AUDIO')}
                variant='secondary'
                onClick={() => {
                  handleUpload(files[0]);
                }}
                style={{ marginRight: theme.spacing(2) }}
                loading={loading}
              />
            )}
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  );
};

export default BroadcasterRecordContainer;
