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
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import useMutation from 'hooks/useMutation';
import useAlert from 'hooks/useAlert';
import useAsync from 'hooks/useAsync';
import RoleDetailsHeader from '../components/RoleDetailsHeader';
import { Role, RoleResource } from 'app/types/role';
import RoleDetailsForm, {
  RoleActionField,
} from '../components/RoleDetailsForm';
import { createRoleValidator } from 'app/utils/validators';
import roleAPI from 'app/api/roleAPI';
import { Resource } from '@tts-dev/common';

interface Props {
  history: RouteComponentProps['history'];
  roleId: string;
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

const defaultValues: RoleActionField = {
  name: '',
  policy: '',
};

const RoleDetailsContainer: React.FC<Props> = ({ history, roleId }) => {
  const { t }: { t: any } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const [role, setRole] = useState<Role>();
  const [deleting, setDeleting] = useState(false);
  const [fetchRoleLoading, setFetchRoleLoading] = useState(false);
  const confirm = useConfirm();
  const { alertSuccess, alertError } = useAlert();
  const { ref, startLoading, endLoading } = useAsync();
  const {
    control,
    formState,
    errors,
    handleSubmit,
    reset,
    setError,
  } = useForm<RoleActionField>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(createRoleValidator),
  });
  const [resources, setResources] = useState<RoleResource[]>([
    { name: Resource.USER, actions: [] },
    { name: Resource.ROLE, actions: [] },
    { name: Resource.SENTENCE, actions: [] },
    { name: Resource.RECORD, actions: [] },
  ]);
  const { doRequest: createRole, loading: createRoleLoading } = useMutation<
    RoleActionField,
    Role
  >(roleAPI.createRole, setError, () => {
    history.push('/roles');
  });
  const { doRequest: updateRole, loading: updateRoleLoading } = useMutation<
    RoleActionField,
    Role
  >(roleAPI.updateRole, setError, () => {
    history.push('/roles');
  });

  useEffect(() => {
    let active = true;

    const fetchRole = async (id: string) => {
      setFetchRoleLoading(true);
      startLoading();

      roleAPI
        .getRole(id)
        .then(fetchedRole => {
          const newResources = resources.map(rs => {
            const resourceMatch = fetchedRole.resources.find(
              resource => resource.name === rs.name
            );

            if (resourceMatch) {
              return { ...rs, actions: resourceMatch.actions };
            } else {
              return { ...rs };
            }
          });
          const formValues = {
            name: fetchedRole.name,
            policy: fetchedRole.policy.official_version || '',
          };

          reset(formValues);
          setRole(fetchedRole);
          setResources(newResources);
          setFetchRoleLoading(false);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          setFetchRoleLoading(false);
          endLoading();
        });
    };

    if (active && roleId) {
      fetchRole(roleId);
    }

    return () => {
      active = false;
      reset(defaultValues);
    };

    // eslint-disable-next-line
  }, [roleId]);

  const handleDelete = async () => {
    if (roleId) {
      confirm({ description: t('WARNING_DELETE_ROLE') })
        .then(() => {
          setDeleting(true);
          return roleAPI.deleteRoles([roleId]);
        })
        .then(users => {
          console.log(users);
          alertSuccess(t('MESSAGE_ALERT_SUCCESS'));
          history.push('/roles');

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
    if (roleId) {
      await updateRole(roleId, {
        name: values.name,
        policy: values.policy,
        resources: resources,
      });
    } else {
      await createRole({
        name: values.name,
        policy: values.policy,
        resources: resources,
      });
    }
  });

  const submitting = createRoleLoading || updateRoleLoading;

  const resourcesValid = resources.every(rs => rs.actions.length === 0)
    ? false
    : true;

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      className={classes.root}
    >
      <LoadingBar color={theme.palette.secondary.main} ref={ref} />
      <Grid item container className={classes.toolbar}>
        <RoleDetailsHeader
          submitForm={submitForm}
          handleDelete={handleDelete}
          loading={fetchRoleLoading}
          submitting={submitting}
          deleting={deleting}
          roleId={roleId}
          isValid={formState.isValid && resourcesValid}
          role={role}
        />
      </Grid>

      <Grid item container>
        <Accordion style={{ width: '100%' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='body1'>{t('MESSAGE_BASIC_INFO')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RoleDetailsForm
              control={control}
              errors={errors}
              resources={resources}
              setResources={setResources}
              resourcesValid={resourcesValid}
            />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default RoleDetailsContainer;
