import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';
import LoadingBar from 'react-top-loading-bar';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import BroadcasterDetailsHeader from '../components/BroadcasterDetailsHeader';
import BroadcasterDetailsForm, {
  BroadcasterActionField,
} from '../components/BroadcasterDetailsForm';

import { DialectType } from '@tts-dev/common';
import userAPI from 'app/api/userAPI';
import voiceAPI from 'app/api/voiceAPI';
import { createBroadcasterValidator } from 'app/utils/validators';
import { Broadcaster } from 'app/types/broadcaster';
import { User } from 'app/types/user';
import { Voice } from 'app/types/voice';

import useAlert from 'hooks/useAlert';
import useAsync from 'hooks/useAsync';
import useAutoComplete from 'hooks/useAutoComplete';
import useMutation from 'hooks/useMutation';
import broadcasterAPI from 'app/api/broadcasterAPI';

interface Props {
  broadcasterId: string;
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    boxShadow: theme.shadows[3],
    borderRadius: 4,
    padding: theme.spacing(2),
  },
  toolbar: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const defaultValues: BroadcasterActionField = {
  types: [],
  user: '',
  voice: '',
  dialect: DialectType.HANOI,
  expiredAt: new Date().toISOString(),
};

const BroadcasterDetailsContainer: React.FC<Props> = ({
  broadcasterId,
  history,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const { alertSuccess, alertError } = useAlert();
  const [broadcaster, setBroadcaster] = useState<Broadcaster | null>(null);
  const [fetching, setFetching] = useState(false);
  const confirm = useConfirm();
  const [deleting, setDeleting] = useState(false);
  const { ref, startLoading, endLoading } = useAsync();
  const {
    control,
    formState,
    errors,
    handleSubmit,
    setError,
    reset,
  } = useForm<BroadcasterActionField>({
    mode: 'onChange',
    defaultValues: defaultValues,
    resolver: yupResolver(createBroadcasterValidator),
  });
  const {
    loading: userSearching,
    searchData: users,
    setSearchData: setUsers,
    setSearchTerm: setUserSearchTerm,
  } = useAutoComplete<User>(userAPI.getUsers);
  const {
    loading: voiceSearching,
    searchData: voices,
    setSearchData: setVoices,
    setSearchTerm: setVoiceSearchTerm,
  } = useAutoComplete<Voice>(voiceAPI.getVoices);
  const { doRequest: createBroadcaster, loading: creating } = useMutation<
    BroadcasterActionField,
    Broadcaster
  >(broadcasterAPI.createBroadcaster, setError, () => {
    alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
    history.push('/broadcasters');
  });
  const { doRequest: updateBroadcaster, loading: updating } = useMutation<
    BroadcasterActionField,
    Broadcaster
  >(broadcasterAPI.updateBroadcaster, setError, () => {
    alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
    history.push('/broadcasters');
  });

  useEffect(() => {
    let active = true;

    const fetchBroadcaster = async (id: string) => {
      setFetching(true);
      startLoading();

      broadcasterAPI
        .getBroadcaster(id)
        .then(broadcaster => {
          setBroadcaster(broadcaster);
          setFetching(false);
          reset({
            user: broadcaster.user,
            voice: broadcaster.voice,
            dialect: broadcaster.dialect,
            expiredAt: broadcaster.expiredAt,
            types: broadcaster.types.map(type => ({
              label: type,
              value: type,
            })),
          });
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setFetching(false);
          endLoading();
        });
    };

    if (broadcasterId && active) {
      fetchBroadcaster(broadcasterId);
    }

    return () => {
      active = false;
    };

    // eslint-disable-next-line
  }, [broadcasterId, reset]);

  useEffect(() => {
    if (errors && Object.values(errors).length > 0) {
      alertError(t('MESSAGE_ALERT_ERROR'));
    }
  }, [errors, alertError, t]);

  const handleDelete = (ids: string[]) => {
    confirm({ description: t('WARNING_DELETE_BROADCASTER') })
      .then(() => {
        setDeleting(true);
        return broadcasterAPI.deleteBroadcasters(ids);
      })
      .then(() => {
        setDeleting(false);
        alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
        history.push('/broadcasters');
      })
      .catch(err => {
        setDeleting(false);
        console.log(err);
        alertError(t('MESSAGE_ALERT_ERROR'));
      });
  };

  const submitForm = handleSubmit(values => {
    const userId = (values.user as User)?.id;
    const voiceId = (values.voice as Voice)?.id;
    const types = values?.types.map(type => type.value);

    if (!broadcasterId) {
      createBroadcaster({
        user: userId,
        voice: voiceId,
        dialect: values.dialect,
        expiredAt: values.expiredAt,
        types: types,
      });
    } else {
      updateBroadcaster(broadcasterId, {
        user: userId,
        voice: voiceId,
        dialect: values.dialect,
        expiredAt: values.expiredAt,
        types: types,
      });
    }
  });

  const titleMarkup = fetching ? (
    <Skeleton variant='text' animation='wave' width={150} />
  ) : (
    <Typography variant='h5'>
      {broadcaster && broadcaster.user
        ? broadcaster.user.username
        : t('ACTIONS_ADD')}
    </Typography>
  );

  return (
    <Grid container direction='column' className={classes.root}>
      <LoadingBar color={theme.palette.secondary.main} ref={ref} />
      <Grid item className={classes.toolbar}>
        <BroadcasterDetailsHeader
          loading={creating || updating}
          isValid={formState.isValid}
          deleting={deleting}
          submitForm={submitForm}
          handleDelete={handleDelete}
          title={titleMarkup}
          broadcasterId={broadcasterId}
        />
      </Grid>

      <Grid item container>
        <Accordion style={{ width: '100%' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='body1'>{t('MESSAGE_BASIC_INFO')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BroadcasterDetailsForm
              control={control}
              errors={errors}
              users={users}
              voices={voices}
              setUsers={setUsers}
              setVoices={setVoices}
              setUserSearchTerm={setUserSearchTerm}
              setVoiceSearchTerm={setVoiceSearchTerm}
              userSearching={userSearching}
              voiceSearching={voiceSearching}
              broadcasterId={broadcasterId}
            />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default BroadcasterDetailsContainer;
