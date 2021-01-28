import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import vkBeautify from 'vkbeautify';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

import FileCopyIcon from '@material-ui/icons/FileCopy';

import allophoneAPI from 'app/api/allophoneAPI';
import DrawerWrapper from 'app/cores/drawer/DrawerWrapper';
import Input from 'app/layout/commons/form/Input';
import Button from 'app/layout/commons/form/Button';
import CopyToClipboard from '../components/CopyToClipboard';
import { AppState, DrawerState } from 'app/redux/rootReducer';
import { DialectType } from '@tts-dev/common';

interface SearchAllophoneForm {
  text: string;
}

const useStyles = makeStyles(theme => ({
  logoWrapper: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
  },
  logo: {
    height: 40,
  },
  container: {
    padding: theme.spacing(1, 2),
  },
  item: {
    marginBottom: theme.spacing(2),
  },
}));

const defaultValues: SearchAllophoneForm = {
  text: '',
};

const SearchAllophoneDrawer: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const { drawerProps, drawerType } = useSelector<AppState, DrawerState>(
    state => state.drawer
  );
  const [allophoneResult, setAllophoneResult] = useState<string | null>(null);
  const [pronunciationResult, setPronunciationResult] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { control, errors, handleSubmit, reset } = useForm<SearchAllophoneForm>(
    {
      mode: 'onChange',
      defaultValues: defaultValues,
    }
  );

  useEffect(() => {
    if (drawerType && drawerType === 'SearchAllophoneDrawer') {
      setAllophoneResult('');
    }
    return () => {
      reset({ text: '' });
      setAllophoneResult('');
    };

    // eslint-disable-next-line
  }, [drawerType]);

  const handleSearch = handleSubmit(async values => {
    if (drawerProps && drawerProps.dialect) {
      const dialect = drawerProps.dialect as DialectType;

      setLoading(true);
      allophoneAPI
        .searchAllophone(values.text, dialect)
        .then(({ pronunciation, allophoneContent }) => {
          const allophoneContentMarkup = vkBeautify.xml(
            allophoneContent.replace(/\s\s+/g, ' ')
          );
          setPronunciationResult(pronunciation);
          setAllophoneResult(allophoneContentMarkup);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  });

  return (
    <DrawerWrapper drawerType='SearchAllophoneDrawer' drawerWidth={600}>
      <div className={classes.logoWrapper}>
        <img alt='vbee logo' src='/full-logo.png' className={classes.logo} />
      </div>
      <Divider />
      <Grid container className={classes.container}>
        <Typography variant='h6' gutterBottom>
          {t('ACTIONS_SEARCH_ALLOPHONE')}
        </Typography>
        <form style={{ width: '100%' }} onSubmit={handleSearch}>
          <Grid container direction='column'>
            <Grid
              item
              container
              className={classes.item}
              alignItems='flex-end'
              justify='space-between'
            >
              <Grid item style={{ flex: 1, marginRight: theme.spacing(2) }}>
                <Input
                  fullWidth
                  control={control}
                  name='text'
                  variant='standard'
                  isError={Boolean(errors?.text)}
                  errorMessage={errors?.text?.message}
                />
              </Grid>
              <Grid item>
                <Button
                  type='submit'
                  variant='primary'
                  loading={loading}
                  content={t('ACTIONS_SEARCH')}
                />
              </Grid>
            </Grid>
            {pronunciationResult && (
              <Grid item container style={{ marginTop: theme.spacing(4) }}>
                <OutlinedInput
                  label={t('FIELDS_RECORD_PRONUNCIATION')}
                  fullWidth
                  disabled
                  value={pronunciationResult}
                  endAdornment={
                    <InputAdornment
                      position='end'
                      style={{
                        position: 'absolute',
                        top: theme.spacing(4),
                        right: theme.spacing(3),
                      }}
                    >
                      <CopyToClipboard>
                        {({ copy }) => (
                          <IconButton
                            onClick={() => copy(pronunciationResult)}
                            size='small'
                            edge='end'
                            color='secondary'
                          >
                            <FileCopyIcon />
                          </IconButton>
                        )}
                      </CopyToClipboard>
                    </InputAdornment>
                  }
                />
              </Grid>
            )}
            {allophoneResult && (
              <Grid item container style={{ marginTop: theme.spacing(4) }}>
                <OutlinedInput
                  inputProps={{
                    style: {
                      fontFamily: "'Fira Code', monospace",
                    },
                  }}
                  label={t('FIELDS_ALLOPHONE')}
                  multiline
                  rowsMax={30}
                  fullWidth
                  disabled
                  value={allophoneResult}
                  endAdornment={
                    <InputAdornment
                      position='end'
                      style={{
                        position: 'absolute',
                        top: theme.spacing(4),
                        right: theme.spacing(3),
                      }}
                    >
                      <CopyToClipboard>
                        {({ copy }) => (
                          <IconButton
                            onClick={() => copy(allophoneResult)}
                            size='small'
                            edge='end'
                            color='secondary'
                          >
                            <FileCopyIcon />
                          </IconButton>
                        )}
                      </CopyToClipboard>
                    </InputAdornment>
                  }
                />
              </Grid>
            )}
          </Grid>
        </form>
      </Grid>
    </DrawerWrapper>
  );
};

export default SearchAllophoneDrawer;
