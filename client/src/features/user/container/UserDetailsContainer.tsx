import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useConfirm } from 'material-ui-confirm';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import useAlert from 'hooks/useAlert';
import useAutoComplete from 'hooks/useAutoComplete';
import { getUserActionValidator } from 'app/utils/validators';
import UserDetailsHeader from '../components/UserDetailsHeader';
import UserDetailsForm, {
  UserActionField,
} from '../components/UserDetailsForm';
import userAPI from 'app/api/userAPI';
import roleAPI from 'app/api/roleAPI';
import { User } from 'app/types/user';
import { Role } from 'app/types/role';
import useMutation from 'hooks/useMutation';

interface Props {
  userId?: string;
  history: RouteComponentProps['history'];
}

const useStyles = makeStyles(theme => ({
  toolbar: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const getDefaultValues = (userId?: string): UserActionField => {
  if (userId) {
    return { username: '', email: '', phoneNumber: '', role: {} };
  }

  return {
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: {},
  };
};

const UserDetailsContainer: React.FC<Props> = ({ userId, history }) => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const [user, setUser] = useState<User>();
  const confirm = useConfirm();
  const { alertSuccess, alertError } = useAlert();
  const [deleting, setDeleting] = useState(false);
  const [fetchUserLoading, setFetchUserLoading] = useState(false);
  const {
    control,
    formState,
    errors,
    handleSubmit,
    reset,
    setError,
  } = useForm<UserActionField>({
    mode: 'onChange',
    defaultValues: getDefaultValues(userId),
    resolver: yupResolver(getUserActionValidator(userId)),
  });
  const {
    loading: searching,
    searchData: roles,
    setSearchData: setRoles,
    setSearchTerm,
  } = useAutoComplete(roleAPI.getRoles);

  const { doRequest: createUser, loading: createUserLoading } = useMutation<
    UserActionField,
    User
  >(userAPI.createUser, setError, () => {
    history.push('/users');
  });
  const { doRequest: updateUser, loading: updateUserLoading } = useMutation<
    UserActionField,
    User
  >(userAPI.updateUser, setError, () => {
    history.push('/users');
  });

  useEffect(() => {
    let active = true;

    const fetchUser = async (id: string) => {
      setFetchUserLoading(true);
      try {
        const fetchedUser = await userAPI.getUser(id);

        setUser(fetchedUser);
        setFetchUserLoading(false);
        const formData = {
          username: fetchedUser.username,
          email: fetchedUser.email,
          phoneNumber: fetchedUser.phoneNumber,
          role: fetchedUser.role,
        };
        reset(formData);
      } catch (err) {
        console.log(err);
        setFetchUserLoading(false);
      }
    };

    if (active && userId) {
      fetchUser(userId);
    }

    return () => {
      active = false;
      reset(getDefaultValues(userId));
    };
  }, [reset, userId]);

  const handleDelete = async () => {
    if (userId) {
      confirm({ description: t('WARNING_DELETE_USER') })
        .then(() => {
          setDeleting(true);
          return userAPI.deleteUsers([userId]);
        })
        .then(users => {
          console.log(users);
          alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
          history.push('/sentences');

          setDeleting(false);
        })
        .catch(err => {
          console.log(err);
          alertError(t('MESSAGE_ALERT_ERROR'));
          setDeleting(false);
        });
    }
  };

  const submitForm = handleSubmit(async values => {
    if (userId) {
      await updateUser(userId, {
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
        roleId: (values.role as Role).id,
      });
    } else {
      await createUser({
        username: values.username,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password!,
        roleId: (values.role as Role).id,
      });
    }
  });

  const submitting = createUserLoading || updateUserLoading;

  return (
    <Grid container direction='column'>
      <Grid item className={classes.toolbar}>
        <UserDetailsHeader
          loading={fetchUserLoading}
          submitting={submitting}
          deleting={deleting}
          isValid={formState.isValid}
          submitForm={submitForm}
          handleDelete={handleDelete}
          userId={userId}
          user={user}
        />
      </Grid>

      <Grid item container>
        <Accordion style={{ width: '100%' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='body1'>{t('MESSAGE_BASIC_INFO')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UserDetailsForm
              control={control}
              errors={errors}
              roles={roles as Role[]}
              setRoles={
                setRoles as React.Dispatch<React.SetStateAction<Role[]>>
              }
              searching={searching}
              setSearchTerm={setSearchTerm}
              userId={userId}
            />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default UserDetailsContainer;
